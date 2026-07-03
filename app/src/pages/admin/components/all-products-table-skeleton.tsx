import type { FC } from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const ROW_COUNT = 6;

export const AllProductsTableSkeleton: FC = () => {
    return (
        <Card className="overflow-x-auto" aria-hidden>
            <table className="w-full min-w-[720px] border-collapse text-left">
                <thead>
                    <tr className="text-xs uppercase tracking-wide text-muted">
                        <th className="px-3 py-2 font-medium">Product</th>
                        <th className="px-3 py-2 font-medium">Barcode</th>
                        <th className="px-3 py-2 font-medium">Safety</th>
                        <th className="px-3 py-2 font-medium">Ingredients</th>
                        <th className="px-3 py-2 text-right font-medium">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {Array.from({ length: ROW_COUNT }).map((_, index) => (
                        <tr key={index} className="border-t border-border align-top">
                            <td className="px-3 py-3">
                                <Skeleton className="h-4 w-40" />
                                <Skeleton className="mt-1.5 h-3 w-24" />
                            </td>
                            <td className="px-3 py-3">
                                <Skeleton className="h-3 w-20" />
                            </td>
                            <td className="px-3 py-3">
                                <Skeleton className="h-5 w-16 rounded-full" />
                            </td>
                            <td className="px-3 py-3">
                                <div className="flex flex-wrap gap-1">
                                    <Skeleton className="h-5 w-14 rounded-md" />
                                    <Skeleton className="h-5 w-12 rounded-md" />
                                </div>
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
