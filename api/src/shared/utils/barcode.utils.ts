const BARCODE_DIGITS_PATTERN = /^\d{8,14}$/;

export const normalize_barcode_digits = (raw: string): string =>
    raw.replace(/\D/g, '');

export const get_barcode_lookup_variants = (raw: string): string[] => {
    const digits = normalize_barcode_digits(raw.trim());

    if (!digits || !BARCODE_DIGITS_PATTERN.test(digits)) {
        return digits ? [digits] : [];
    }

    const variants = new Set<string>([digits]);

    if (digits.length === 12) {
        variants.add(`0${digits}`);
    }

    if (digits.length === 13 && digits.startsWith('0')) {
        variants.add(digits.slice(1));
    }

    return [...variants];
};

export const extract_barcode_from_text = (raw_text: string): string | null => {
    if (!raw_text?.trim()) {
        return null;
    }

    const matches = raw_text.match(/\b\d{8,14}\b/g);

    if (!matches?.length) {
        return null;
    }

    return matches.sort((left, right) => right.length - left.length)[0] ?? null;
};
