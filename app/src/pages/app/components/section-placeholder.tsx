import type { FC, ReactNode } from "react";
import { Card } from "@/components/ui/card";

interface SectionPlaceholderProps {
    title: string;
    description: string;
    children?: ReactNode;
}

export const SectionPlaceholder: FC<SectionPlaceholderProps> = ({ title, description, children }) => {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold text-foreground" style={{ fontFamily: "var(--heading)" }}>
                    {title}
                </h1>
                <p className="mt-1 text-sm text-muted">{description}</p>
            </div>
            {children ?? (
                <Card className="p-8 text-center">
                    <p className="text-sm font-medium text-foreground">Coming soon</p>
                    <p className="mt-1 text-xs text-muted">This section is on the roadmap for the next release.</p>
                </Card>
            )}
        </div>
    );
};
