import type { FC } from "react";
import { AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type CreationErrorStateProps = {
    error_message: string;
    on_retry: () => void;
};

const CreationErrorState: FC<CreationErrorStateProps> = ({
    error_message,
    on_retry,
}) => {
    return (
        <div className="space-y-4">
            <div>
                <h1
                    className="text-2xl font-semibold text-foreground"
                    style={{ fontFamily: "var(--heading)" }}
                >
                    Analysis failed
                </h1>
                <p className="mt-1 text-sm text-muted">
                    We couldn't finish analyzing this product.
                </p>
            </div>

            <Card className="flex flex-col items-center gap-3 p-6 text-center">
                <AlertTriangle className="h-8 w-8 text-danger" />
                <p className="text-sm text-foreground">{error_message}</p>
            </Card>

            <Button type="button" variant="scan" className="w-full" onClick={on_retry}>
                Retake Photos
            </Button>
        </div>
    );
};

export default CreationErrorState;
