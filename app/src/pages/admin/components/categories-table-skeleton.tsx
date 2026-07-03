import type { FC } from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const ROW_COUNT = 5;

export const CategoriesTableSkeleton: FC = () => {
    return (
        <Card className="overflow-x-auto" aria-hidden>
            <table className="w-full min-w-[640px] border-collapse text-left">
                <thead>
                    <tr className="text-xs uppercase tracking-wide text-muted">
                        <th className="px-3 py-2 font-medium">Name</th>
                        <th className="px-3 py-2 font-medium">Slug</th>
                        <th className="px-3 py-2 font-medium">Order</th>
                        <th className="px-3 py-2 text-right font-medium">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {Array.from({ length: ROW_COUNT }).map((_, index) => (
                        <tr
                            key={index}
                            className="border-t-2 border-border bg-surface-secondary/30"
                        >
                            <td className="px-3 py-3">
                                <Skeleton className="h-4 w-32" />
                            </td>
                            <td className="px-3 py-3">
                                <Skeleton className="h-3 w-24" />
                            </td>
                            <td className="px-3 py-3">
                                <Skeleton className="h-3 w-8" />
                            </td>
                            <td className="px-3 py-3">
                                <div className="flex justify-end">
                                    <Skeleton className="h-8 w-8 rounded-lg" />
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </Card>
    );
};
