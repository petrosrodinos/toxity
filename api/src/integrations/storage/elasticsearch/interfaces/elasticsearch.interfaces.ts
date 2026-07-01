export interface SearchQuery {
    q?: string;
    page?: number;
    limit?: number;
}

export interface SearchResult<T = Record<string, unknown>> {
    hits: (T & { _id: string; _score?: number })[];
    total: number;
}

export interface IndexMappings {
    properties: Record<string, unknown>;
}
