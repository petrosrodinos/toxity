import { useState, type FC } from "react";
import { Heart, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const ProductDetailTabs = {
    ANALYSIS: "analysis",
    AI_CHAT: "ai_chat",
} as const;

type ProductDetailTab =
    (typeof ProductDetailTabs)[keyof typeof ProductDetailTabs];

export const ProductDetailToolbar: FC = () => {
    const [active_tab, set_active_tab] = useState<ProductDetailTab>(
        ProductDetailTabs.ANALYSIS,
    );

    const handle_share = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            toast({
                title: "Link copied",
                description: "Share this product with anyone who has access.",
                duration: 2000,
            });
        } catch {
            toast({
                title: "Could not copy link",
                description: "Please copy the URL from your browser bar.",
                variant: "error",
            });
        }
    };

    return (
        <div className="flex flex-wrap items-center gap-3">
            <div
                className="inline-flex rounded-xl border border-border bg-surface p-1"
                role="tablist"
                aria-label="Product detail sections"
            >
                <button
                    type="button"
                    role="tab"
                    aria-selected={active_tab === ProductDetailTabs.ANALYSIS}
                    onClick={() => set_active_tab(ProductDetailTabs.ANALYSIS)}
                    className={cn(
                        "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                        active_tab === ProductDetailTabs.ANALYSIS
                            ? "bg-accent text-accent-foreground"
                            : "text-muted hover:text-foreground",
                    )}
                >
                    Analysis
                </button>
                <button
                    type="button"
                    role="tab"
                    aria-selected={active_tab === ProductDetailTabs.AI_CHAT}
                    disabled
                    title="AI Chat coming soon"
                    className="cursor-not-allowed rounded-lg px-3 py-1.5 text-sm font-medium text-muted opacity-50"
                >
                    AI Chat
                </button>
            </div>

            <div className="ml-auto flex items-center gap-2">
                <Button
                    type="button"
                    variant="outline"
                    aria-label="Favorite (coming soon)"
                    disabled
                    title="Favorites coming soon"
                    className="h-10 w-10 px-0"
                >
                    <Heart className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    aria-label="Share product link"
                    onClick={() => void handle_share()}
                    className="h-10 w-10 px-0"
                >
                    <Share2 className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
};
