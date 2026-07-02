import { Link } from "react-router-dom";
import type { FC, ReactNode } from "react";
import { Routes } from "@/routes/routes";
import { cn } from "@/lib/utils";

interface IngredientLinkProps {
    ingredient_uuid: string;
    name: string;
    className?: string;
}

/** Reusable link to ingredient detail — use from product accordions in Feature 06. */
export const IngredientLink: FC<IngredientLinkProps> = ({
    ingredient_uuid,
    name,
    className,
}) => {
    return (
        <Link
            to={Routes.ingredients.detail(ingredient_uuid)}
            className={cn(
                "font-medium text-accent underline-offset-4 hover:underline",
                className,
            )}
        >
            {name}
        </Link>
    );
};

interface IngredientDetailSectionProps {
    title: string;
    children: ReactNode;
}

export const IngredientDetailSection: FC<IngredientDetailSectionProps> = ({
    title,
    children,
}) => {
    return (
        <section className="space-y-3">
            <h2
                className="text-base font-semibold text-foreground"
                style={{ fontFamily: "var(--heading)" }}
            >
                {title}
            </h2>
            <div className="space-y-3 text-sm text-foreground/90">{children}</div>
        </section>
    );
};

interface IngredientDetailFieldProps {
    label: string;
    value?: string | number | boolean | null;
}

export const IngredientDetailField: FC<IngredientDetailFieldProps> = ({
    label,
    value,
}) => {
    if (value === null || value === undefined || value === "") {
        return null;
    }

    const display_value =
        typeof value === "boolean" ? (value ? "Yes" : "No") : String(value);

    return (
        <div>
            <p className="text-xs font-mono font-medium uppercase tracking-wide text-muted">
                {label}
            </p>
            <p className="mt-1 leading-relaxed">{display_value}</p>
        </div>
    );
};
