import { useState } from "react";
import { ScanLine } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ProductCard, { ProductCardSkeleton } from "@/components/product-card";
import { useGetScans } from "@/features/scans/hooks/use-scans";
import { format_date } from "@/lib/date";
import { Routes } from "@/routes/routes";

const PAGE_LIMIT = 20;

export default function HistoryPage() {
    const navigate = useNavigate();
    const [page, set_page] = useState(1);
    const { data, isLoading, isFetching } = useGetScans({ page, limit: PAGE_LIMIT });

    const scans = data?.data ?? [];
    const has_next = data?.pagination.has_next ?? false;

    return (
        <div className="mx-auto flex max-w-lg flex-col gap-6 pb-8">
            <div>
                <h1
                    className="text-2xl font-semibold text-foreground"
                    style={{ fontFamily: "var(--heading)" }}
                >
                    History
                </h1>
                <p className="mt-1 text-sm text-muted">
                    Every product you've scanned, newest first.
                </p>
            </div>

            {isLoading ? (
                <div className="space-y-2">
                    {Array.from({ length: 5 }).map((_, index) => (
                        <ProductCardSkeleton key={index} />
                    ))}
                </div>
            ) : scans.length === 0 ? (
                <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border p-8 text-center">
                    <p className="text-sm font-medium text-foreground">
                        No scans yet
                    </p>
                    <p className="text-sm text-muted">
                        Scan your first product to start building your history.
                    </p>
                    <Button variant="scan" onClick={() => navigate(Routes.scan.root)}>
                        <ScanLine className="h-4 w-4" />
                        Scan a product
                    </Button>
                </div>
            ) : (
                <div className="space-y-2">
                    {scans.map((scan) => (
                        <ProductCard
                            key={scan.uuid}
                            product={scan.product}
                            subtitle={format_date(scan.scanned_at)}
                        />
                    ))}
                </div>
            )}

            {scans.length > 0 && (page > 1 || has_next) ? (
                <div className="flex items-center justify-between gap-3">
                    <Button
                        variant="outline"
                        disabled={page <= 1}
                        onClick={() => set_page((current) => Math.max(1, current - 1))}
                    >
                        Previous
                    </Button>
                    <span className="text-sm text-muted">Page {page}</span>
                    <Button
                        variant="outline"
                        disabled={!has_next}
                        loading={isFetching}
                        onClick={() => set_page((current) => current + 1)}
                    >
                        Next
                    </Button>
                </div>
            ) : null}
        </div>
    );
}
