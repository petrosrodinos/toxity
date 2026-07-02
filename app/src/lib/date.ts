export const format_date = (value: string | Date): string => {
    const date = typeof value === "string" ? new Date(value) : value;

    return date.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
};
