const INGREDIENT_HEADER_PATTERN =
    /^(ingredients?|composition|inci|contains|συστατικ[άα]|συνθεση)\s*[:\-]?\s*/i;

const NON_INGREDIENT_LINE_PATTERN =
    /^(may contain|allergen|warning|caution|οδηγίες|οδηγιες|χρήσεως|χρησεως|usage|directions|store in|keep out|best before|expiry|batch|lot\b)/i;

const NON_INGREDIENT_CONTENT_PATTERN =
    /\b(take \d|capsules?|tablets?|ημερησίως|ημερησιως|προτεινόμενη|προτεινομενη|do not exceed|per day|daily dose|λήψη|ληψη|σύμφωνα με|συμφωνα με|ιχθυελαίου|ιχθυελαιου)\b/i;

const DATE_OR_BATCH_LINE_PATTERN =
    /^\d{1,2}[\/\-\.]\d{2,4}$|^\d{2}[\/\-\.]\d{2}[\/\-\.]\d{2,4}$|^[A-Z]{0,3}\s*\d{3,}$/i;

export {
    NON_INGREDIENT_LINE_PATTERN,
    NON_INGREDIENT_CONTENT_PATTERN,
    DATE_OR_BATCH_LINE_PATTERN,
};

const CLAIM_KEYWORDS = [
    'vegan',
    'cruelty-free',
    'cruelty free',
    'organic',
    'natural',
    'paraben-free',
    'paraben free',
    'sulfate-free',
    'sulfate free',
    'gluten-free',
    'gluten free',
    'non-gmo',
    'dermatologist tested',
    'hypoallergenic',
    'fragrance-free',
    'fragrance free',
];

/**
 * Parse a raw ingredient-list OCR string into individual INCI ingredient names.
 */
export function parse_ingredients_from_text(raw_text: string): string[] {
    if (!raw_text?.trim()) {
        return [];
    }

    let text = raw_text.replace(/\r\n/g, '\n').trim();

    const header_match = text.match(INGREDIENT_HEADER_PATTERN);
    if (header_match) {
        text = text.slice(header_match[0].length).trim();
    }

    // Single-line lists: split on commas/semicolons, respecting parentheses depth.
    const ingredients: string[] = [];
    let current = '';
    let depth = 0;

    for (const char of text) {
        if (char === '(' || char === '[') {
            depth += 1;
            current += char;
        } else if (char === ')' || char === ']') {
            depth = Math.max(0, depth - 1);
            current += char;
        } else if ((char === ',' || char === ';') && depth === 0) {
            const cleaned = clean_ingredient_token(current);
            if (cleaned) {
                ingredients.push(cleaned);
            }
            current = '';
        } else {
            current += char;
        }
    }

    const last = clean_ingredient_token(current);
    if (last) {
        ingredients.push(last);
    }

    return dedupe_ingredients(ingredients);
}

function clean_ingredient_token(token: string): string | null {
    let cleaned = token
        .replace(/^[\d\.\)\s]+/, '')
        .replace(/[.\s]+$/, '')
        .replace(/\s+/g, ' ')
        .trim();

    cleaned = cleaned.replace(/\.$/, '').trim();

    if (!cleaned || cleaned.length < 2 || cleaned.length > 120) {
        return null;
    }

    if (NON_INGREDIENT_LINE_PATTERN.test(cleaned)) {
        return null;
    }

    if (NON_INGREDIENT_CONTENT_PATTERN.test(cleaned)) {
        return null;
    }

    if (DATE_OR_BATCH_LINE_PATTERN.test(cleaned)) {
        return null;
    }

    const word_count = cleaned.split(/\s+/).length;
    if (word_count > 8) {
        return null;
    }

    return cleaned;
}

function dedupe_ingredients(ingredients: string[]): string[] {
    const seen = new Set<string>();
    const result: string[] = [];

    for (const ingredient of ingredients) {
        const key = ingredient.toLowerCase();
        if (!seen.has(key)) {
            seen.add(key);
            result.push(ingredient);
        }
    }

    return result;
}

export function extract_claims_from_text(raw_text: string): string[] {
    if (!raw_text?.trim()) {
        return [];
    }

    const lower = raw_text.toLowerCase();
    const claims: string[] = [];

    for (const keyword of CLAIM_KEYWORDS) {
        if (lower.includes(keyword)) {
            claims.push(keyword);
        }
    }

    return [...new Set(claims)];
}

/**
 * Heuristic extraction of product name and brand from front-label OCR text.
 */
export function parse_front_label_text(raw_text: string): {
    name: string | null;
    brand: string | null;
} {
    if (!raw_text?.trim()) {
        return { name: null, brand: null };
    }

    const lines = raw_text
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line.length > 1);

    if (lines.length === 0) {
        return { name: null, brand: null };
    }

    const usable_lines = lines.filter(
        (line) =>
            !DATE_OR_BATCH_LINE_PATTERN.test(line) &&
            !NON_INGREDIENT_LINE_PATTERN.test(line) &&
            !NON_INGREDIENT_CONTENT_PATTERN.test(line),
    );

    if (usable_lines.length === 0) {
        return { name: null, brand: null };
    }

    const brand =
        usable_lines.find(
            (line) =>
                line.length >= 2 &&
                line.length <= 40 &&
                !/^\d/.test(line) &&
                !/fish oil|omega|vitamin|cream|lotion|serum/i.test(line),
        ) ?? usable_lines[0] ?? null;

    const name_line = usable_lines.find(
        (line) =>
            line !== brand &&
            line.length > 3 &&
            line.length <= 80 &&
            !/^(net|wt|volume|ml|oz|g|kg|fl)/i.test(line) &&
            !/^\d/.test(line),
    );

    return {
        brand,
        name: name_line ?? null,
    };
}
