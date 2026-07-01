import {
    Inject,
    Injectable,
    Logger,
} from '@nestjs/common';
import { Client } from '@elastic/elasticsearch';
import { AiService } from '@/integrations/ai/services/ai.service';
import { ELASTICSEARCH_CLIENT } from './elasticsearch.constants';
import {
    IndexMappings,
    SearchQuery,
    SearchResult,
} from './interfaces/elasticsearch.interfaces';

@Injectable()
export class ElasticsearchService {
    private readonly logger = new Logger(ElasticsearchService.name);

    constructor(
        @Inject(ELASTICSEARCH_CLIENT) private readonly client: Client | null,
        private readonly aiService: AiService,
    ) { }

    get enabled(): boolean {
        return this.client !== null;
    }

    async ensureIndex(index: string, mappings: IndexMappings): Promise<void> {
        if (!this.client) return;
        try {
            const exists = await this.client.indices.exists({ index });
            if (exists) return;
            await this.client.indices.create({ index, mappings });
            this.logger.log(`Created Elasticsearch index: ${index}`);
        } catch (error) {
            this.logger.warn(
                `ensureIndex(${index}) failed: ${this.errMsg(error)}`,
            );
            throw error;
        }
    }

    async index(
        index: string,
        id: string,
        document: Record<string, unknown>,
        embed_text?: string,
    ): Promise<void> {
        if (!this.client) return;
        try {
            const payload = { ...document };
            if (embed_text !== undefined) {
                payload.embedding = await this.embed(embed_text);
            }
            await this.client.index({ index, id, document: payload });
        } catch (error) {
            this.logger.warn(`index(${index}, ${id}) failed: ${this.errMsg(error)}`);
        }
    }

    async delete(index: string, id: string): Promise<void> {
        if (!this.client) return;
        try {
            await this.client.delete({ index, id });
        } catch (error: unknown) {
            const status = (error as { meta?: { statusCode?: number } })?.meta?.statusCode;
            if (status === 404) return;
            this.logger.warn(`delete(${index}, ${id}) failed: ${this.errMsg(error)}`);
        }
    }

    async search<T = Record<string, unknown>>(
        index: string,
        query: SearchQuery,
        filter: unknown[] = [],
    ): Promise<SearchResult<T>> {
        if (!this.client) return { hits: [], total: 0 };

        const limit = query.limit ?? 20;
        const page = query.page ?? 1;
        const from = (page - 1) * limit;

        try {
            if (query.q) {
                const vector = await this.embed(query.q);
                const response = await this.client.search({
                    index,
                    from,
                    size: limit,
                    _source_excludes: ['embedding'],
                    knn: {
                        field: 'embedding',
                        query_vector: vector,
                        k: limit * 5,
                        num_candidates: Math.max(limit * 20, 100),
                        filter,
                    },
                });
                return this.formatResponse<T>(response);
            }

            const response = await this.client.search({
                index,
                from,
                size: limit,
                _source_excludes: ['embedding'],
                query: { bool: { must: [{ match_all: {} }], filter } },
            });
            return this.formatResponse<T>(response);
        } catch (error) {
            this.logger.warn(`search(${index}) failed: ${this.errMsg(error)}`);
            return { hits: [], total: 0 };
        }
    }

    private async embed(text: string): Promise<number[]> {
        return this.aiService.embedText(text.trim() || ' ');
    }

    private formatResponse<T>(response: any): SearchResult<T> {
        const hits = response.hits?.hits ?? [];
        const total =
            typeof response.hits?.total === 'number'
                ? response.hits.total
                : response.hits?.total?.value ?? 0;
        return {
            hits: hits.map((hit: any) => ({ _id: hit._id, _score: hit._score, ...hit._source })),
            total,
        };
    }

    private errMsg(error: unknown): string {
        return error instanceof Error ? error.message : 'Unknown error';
    }
}
