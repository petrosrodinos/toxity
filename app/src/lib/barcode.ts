const BARCODE_DIGITS_PATTERN = /^\d{8,14}$/;

export const normalize_barcode = (raw: string): string =>
    raw.replace(/\D/g, "");

export const get_barcode_lookup_candidates = (raw: string): string[] => {
    const digits = normalize_barcode(raw.trim());

    if (!digits) {
        return [];
    }

    if (!BARCODE_DIGITS_PATTERN.test(digits)) {
        return [digits];
    }

    const candidates = new Set<string>([digits]);

    if (digits.length === 12) {
        candidates.add(`0${digits}`);
    }

    if (digits.length === 13 && digits.startsWith("0")) {
        candidates.add(digits.slice(1));
    }

    return [...candidates];
};
