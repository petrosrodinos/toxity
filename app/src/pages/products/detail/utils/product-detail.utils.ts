import {
    ColorIndicators,
    type ColorIndicator,
} from "@/components/ui/safety-badge";

export const to_color_indicator = (value: string): ColorIndicator => {
    if (value in ColorIndicators) {
        return value as ColorIndicator;
    }
    return ColorIndicators.UNKNOWN;
};

export const format_score = (score?: string | null) => {
    if (!score) return null;
    return `${score} / 20`;
};
