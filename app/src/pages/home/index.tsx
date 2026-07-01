import { ScanLine } from "lucide-react";
import { useAuthStore } from "@/stores/auth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SafetyBadge, ColorIndicators } from "@/components/ui/safety-badge";

const feed_sections = [
    { title: "Continue scanning", description: "Pick up where you left off" },
    { title: "Trending products", description: "Popular in the community" },
    { title: "Top rated", description: "Highest ingredient scores" },
    { title: "Browse categories", description: "Beauty, food, baby, and more" },
];

export default function HomePage() {
    const { full_name, email } = useAuthStore();
    const display_name = full_name || email || "there";

    return (
        <div className="space-y-6">
            <Card className="p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-foreground">Welcome back, {display_name}</h1>
                        <p className="mt-1 text-sm text-muted">
                            Scan a product to see AI-powered ingredient analysis and safety insights.
                        </p>
                    </div>
                    <Button variant="scan" className="w-full sm:w-auto shrink-0">
                        <ScanLine className="h-4 w-4" />
                        Scan product
                    </Button>
                </div>
            </Card>

            <div className="flex flex-wrap gap-2">
                <SafetyBadge indicator={ColorIndicators.VERY_SAFE} compact />
                <SafetyBadge indicator={ColorIndicators.MODERATE} compact />
                <SafetyBadge indicator={ColorIndicators.CAUTION} compact />
                <SafetyBadge indicator={ColorIndicators.UNKNOWN} compact />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {feed_sections.map((section) => (
                    <Card key={section.title} className="p-5">
                        <p className="text-sm font-semibold text-foreground" style={{ fontFamily: "var(--heading)" }}>
                            {section.title}
                        </p>
                        <p className="mt-1 text-xs text-muted">{section.description}</p>
                        <div className="mt-4 space-y-2">
                            {[1, 2].map((i) => (
                                <div key={i} className="h-10 rounded-lg bg-surface-secondary animate-pulse" />
                            ))}
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
