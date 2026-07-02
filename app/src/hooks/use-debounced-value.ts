import { useEffect, useState } from "react";

export const useDebouncedValue = <T,>(value: T, delay_ms = 350): T => {
    const [debounced_value, set_debounced_value] = useState(value);

    useEffect(() => {
        const timeout = window.setTimeout(() => {
            set_debounced_value(value);
        }, delay_ms);

        return () => window.clearTimeout(timeout);
    }, [value, delay_ms]);

    return debounced_value;
};
