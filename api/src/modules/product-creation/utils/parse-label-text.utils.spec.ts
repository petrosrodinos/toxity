import {
    extract_claims_from_text,
    parse_front_label_text,
    parse_ingredients_from_text,
} from './parse-label-text.utils';

describe('parse_ingredients_from_text', () => {
    it('splits comma-separated INCI list', () => {
        const result = parse_ingredients_from_text(
            'Aqua, Glycerin, Cetearyl Alcohol, Phenoxyethanol',
        );

        expect(result).toEqual([
            'Aqua',
            'Glycerin',
            'Cetearyl Alcohol',
            'Phenoxyethanol',
        ]);
    });

    it('strips Ingredients header', () => {
        const result = parse_ingredients_from_text(
            'Ingredients: Aqua, Glycerin, Tocopherol',
        );

        expect(result).toEqual(['Aqua', 'Glycerin', 'Tocopherol']);
    });

    it('preserves parenthetical INCI synonyms', () => {
        const result = parse_ingredients_from_text(
            'Aqua (Water), Tocopherol (Vitamin E), Glycerin',
        );

        expect(result).toEqual([
            'Aqua (Water)',
            'Tocopherol (Vitamin E)',
            'Glycerin',
        ]);
    });

    it('deduplicates case-insensitively', () => {
        const result = parse_ingredients_from_text('Glycerin, glycerin, Aqua');

        expect(result).toEqual(['Glycerin', 'Aqua']);
    });
});

describe('parse_front_label_text', () => {
    it('extracts brand from first line and name from second', () => {
        const result = parse_front_label_text(
            'CeraVe\nMoisturizing Cream\nNet Wt 16 oz',
        );

        expect(result.brand).toBe('CeraVe');
        expect(result.name).toBe('Moisturizing Cream');
    });
});

describe('extract_claims_from_text', () => {
    it('finds marketing claims in label text', () => {
        const result = extract_claims_from_text(
            'Vegan and cruelty-free formula with organic botanicals',
        );

        expect(result).toContain('vegan');
        expect(result).toContain('cruelty-free');
        expect(result).toContain('organic');
    });
});
