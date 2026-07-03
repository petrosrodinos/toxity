import type { FC } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export const ProfileSettingsFormSkeleton: FC = () => {
    return (
        <div className="grid gap-4 max-w-md" aria-hidden>
            <div className="flex flex-col gap-1">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-10 w-full" />
            </div>

            <div className="flex flex-col gap-1">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
            </div>

            <div className="flex flex-col gap-1">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-11 w-full rounded-xl" />
            </div>

            <Skeleton className="h-10 w-32" />
        </div>
    );
};
