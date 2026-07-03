import type { FC } from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const ProductCreateInitializingSkeleton: FC = () => {
    return (
        <div className="space-y-4" aria-hidden>
            <Skeleton className="h-3 w-20" />
            <div className="space-y-2">
                <Skeleton className="h-7 w-3/4" />
                <Skeleton className="h-4 w-full" />
            </div>

            <Card className="overflow-hidden p-0">
                <Skeleton className="aspect-[4/3] w-full rounded-none" />
            </Card>

            <div className="space-y-1.5">
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-3/4" />
            </div>

            <Skeleton className="h-11 w-full rounded-xl" />
        </div>
    );
};

export default ProductCreateInitializingSkeleton;
