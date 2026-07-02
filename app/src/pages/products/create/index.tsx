import type { FC } from "react";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Routes } from "@/routes/routes";

const ProductCreatePage: FC = () => {
    const navigate = useNavigate();
    const [search_params] = useSearchParams();
    const barcode = search_params.get("barcode");

    return (
        <div className="mx-auto max-w-lg space-y-6 pb-8">
            <div className="flex items-start gap-3">
                <Link
                    to={Routes.scan.root}
                    aria-label="Back to scan"
                    className="mt-0.5 inline-flex h-10 shrink-0 items-center justify-center rounded-xl px-2 text-foreground transition-colors hover:bg-surface-secondary"
                >
                    <ArrowLeft className="h-4 w-4" />
                </Link>
                <div>
                    <h1
                        className="text-2xl font-semibold text-foreground"
                        style={{ fontFamily: "var(--heading)" }}
                    >
                        Product not found
                    </h1>
                    <p className="mt-1 text-sm text-muted">
                        This product is not in our database yet.
                    </p>
                </div>
            </div>

            <Card className="space-y-3 p-5">
                {barcode ? (
                    <p className="text-sm text-foreground">
                        Barcode <span className="font-mono">{barcode}</span> was
                        not recognized.
                    </p>
                ) : null}
                <p className="text-sm text-muted">
                    Full product creation with label photos and AI analysis is
                    coming soon. Your barcode has been preserved for when that
                    flow is available.
                </p>
            </Card>

            <Button
                variant="outline"
                type="button"
                onClick={() => navigate(Routes.scan.root)}
            >
                Scan another product
            </Button>
        </div>
    );
};

export default ProductCreatePage;
