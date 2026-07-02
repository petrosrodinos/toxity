import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Prisma } from 'generated/prisma';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { OcrResult } from '@/integrations/ocr/interfaces/ocr.interfaces';
import { PRODUCT_ANALYSIS_AI_VERSION } from '@/integrations/ai/prompts/product-analysis';
import {
    ProductAnalysisResolverService,
    TransactionClient,
} from '@/modules/product-creation/product-analysis-resolver.service';

const product_reanalysis_include = {
    brand: true,
    product_ingredients: {
        orderBy: { position: 'asc' as const },
        include: { ingredient: true },
    },
} satisfies Prisma.ProductInclude;

type ProductForReanalysis = Prisma.ProductGetPayload<{
    include: typeof product_reanalysis_include;
}>;

@Injectable()
export class ProductReanalysisRunner {
    private readonly logger = new Logger(ProductReanalysisRunner.name);

    constructor(
        private readonly prisma: PrismaService,
        private readonly resolver: ProductAnalysisResolverService,
    ) {}

    async run(product_uuid: string): Promise<void> {
        try {
            const product = await this.prisma.product.findUnique({
                where: { uuid: product_uuid },
                include: product_reanalysis_include,
            });

            if (!product) {
                throw new NotFoundException('Product not found');
            }

            await this.snapshot(product);

            const ocr_result = this.toSyntheticOcrResult(product);
            const analysis = await this.resolver.generateAnalysis(
                ocr_result,
                product.barcode,
            );

            await this.prisma.$transaction((tx) =>
                this.applyAnalysis(tx, product.uuid, ocr_result, analysis),
            );
        } catch (error) {
            this.logger.error(
                `Product reanalysis failed for ${product_uuid}: ${error.message}`,
                error.stack,
            );
        }
    }

    private toSyntheticOcrResult(product: ProductForReanalysis): OcrResult {
        return {
            name: product.name,
            brand: product.brand.name,
            ingredients: product.product_ingredients.map(
                (item) => item.ingredient.name,
            ),
            claims: product.marketing_claims,
        };
    }

    private async snapshot(product: ProductForReanalysis): Promise<void> {
        const snapshot = {
            name: product.name,
            description: product.description,
            ai_summary: product.ai_summary,
            benefits: product.benefits,
            risks: product.risks,
            warnings: product.warnings,
            suitability: product.suitability,
            recommended_usage: product.recommended_usage,
            storage_info: product.storage_info,
            pregnancy_safety: product.pregnancy_safety,
            children_safety: product.children_safety,
            sensitive_skin_safety: product.sensitive_skin_safety,
            allergy_warnings: product.allergy_warnings,
            environmental_impact: product.environmental_impact,
            is_vegan: product.is_vegan,
            is_cruelty_free: product.is_cruelty_free,
            overall_score: product.overall_score.toString(),
            color_indicator: product.color_indicator,
            scientific_confidence: product.scientific_confidence?.toString() ?? null,
            package_size: product.package_size,
            faq: product.faq,
            brand_uuid: product.brand_uuid,
            subcategory_uuid: product.subcategory_uuid,
            ingredients: product.product_ingredients.map((item) => ({
                uuid: item.ingredient.uuid,
                name: item.ingredient.name,
                position: item.position,
            })),
        };

        await this.prisma.productAnalysisVersion.create({
            data: {
                product_uuid: product.uuid,
                ai_version: product.ai_version,
                snapshot: snapshot as unknown as Prisma.InputJsonValue,
            },
        });
    }

    private async applyAnalysis(
        tx: TransactionClient,
        product_uuid: string,
        ocr_result: OcrResult,
        analysis: Awaited<
            ReturnType<ProductAnalysisResolverService['generateAnalysis']>
        >,
    ): Promise<void> {
        const brand_uuid = await this.resolver.resolveBrand(tx, analysis);
        const subcategory_uuid = await this.resolver.resolveSubcategory(
            tx,
            analysis,
        );
        const ingredient_uuids = await this.resolver.resolveIngredients(
            tx,
            analysis.ingredients,
        );

        await tx.product.update({
            where: { uuid: product_uuid },
            data: {
                name: analysis.product_name.trim(),
                brand_uuid,
                subcategory_uuid,
                description: analysis.description,
                ai_summary: analysis.ai_summary,
                benefits: analysis.benefits,
                risks: analysis.risks,
                warnings: analysis.warnings,
                suitability: analysis.suitability,
                recommended_usage: analysis.recommended_usage,
                storage_info: analysis.storage_info,
                pregnancy_safety: analysis.pregnancy_safety,
                children_safety: analysis.children_safety,
                sensitive_skin_safety: analysis.sensitive_skin_safety,
                allergy_warnings: analysis.allergy_warnings,
                environmental_impact: analysis.environmental_impact,
                is_vegan: analysis.is_vegan,
                is_cruelty_free: analysis.is_cruelty_free,
                overall_score: analysis.overall_score,
                color_indicator: analysis.color_indicator,
                scientific_confidence: analysis.scientific_confidence,
                marketing_claims: ocr_result.claims,
                package_size: analysis.package_size,
                ai_version: PRODUCT_ANALYSIS_AI_VERSION,
                faq: analysis.faq
                    ? (analysis.faq as unknown as Prisma.InputJsonValue)
                    : Prisma.JsonNull,
                // verification_status, is_featured, scan_count, and barcode
                // are intentionally untouched — reanalysis refreshes the AI
                // write-up, it does not change moderation state or identity.
            },
        });

        await tx.productIngredient.deleteMany({ where: { product_uuid } });
        await tx.productIngredient.createMany({
            data: ingredient_uuids.map((ingredient_uuid, index) => ({
                product_uuid,
                ingredient_uuid,
                position: index,
            })),
        });
    }
}
