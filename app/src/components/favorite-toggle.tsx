import type { FC } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
    useAddFavorite,
    useCheckFavorite,
    useRemoveFavorite,
} from "@/features/favorites/hooks/use-favorites";
import type { FavoriteEntityType } from "@/features/favorites/interfaces/favorites.interfaces";

type FavoriteToggleProps = {
    entity_type: FavoriteEntityType;
    entity_uuid: string;
    className?: string;
};

const FavoriteToggle: FC<FavoriteToggleProps> = ({
    entity_type,
    entity_uuid,
    className,
}) => {
    const { data, isLoading } = useCheckFavorite(entity_type, entity_uuid);
    const add_favorite = useAddFavorite();
    const remove_favorite = useRemoveFavorite();

    const is_favorited = data?.is_favorited ?? false;
    const is_pending = isLoading || add_favorite.isPending || remove_favorite.isPending;

    const handle_click = () => {
        if (is_favorited && data?.favorite_uuid) {
            remove_favorite.mutate(data.favorite_uuid);
        } else {
            add_favorite.mutate({ entity_type, entity_uuid });
        }
    };

    return (
        <Button
            type="button"
            variant="outline"
            aria-label={is_favorited ? "Remove from favorites" : "Add to favorites"}
            disabled={is_pending}
            onClick={handle_click}
            className={cn("h-10 w-10 px-0", className)}
        >
            <Heart
                className={cn(
                    "h-4 w-4",
                    is_favorited && "fill-danger text-danger",
                )}
            />
        </Button>
    );
};

export default FavoriteToggle;
