import type { FC } from "react";
import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import FavoriteToggle from "@/components/favorite-toggle";
import { toast } from "@/hooks/use-toast";

export const ProductDetailToolbar: FC<{ product_uuid: string }> = ({
    product_uuid,
}) => {
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
        <div className="flex items-center justify-end gap-2">
            <FavoriteToggle entity_type="PRODUCT" entity_uuid={product_uuid} />
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
    );
};
