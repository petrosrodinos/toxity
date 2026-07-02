import { type FC, useCallback, useEffect, useRef, useState } from "react";
import { Camera, ScanLine } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useBarcodeLookup } from "@/features/scan/hooks/use-barcode-lookup";
import { useBarcodeScanner } from "./hooks/use-barcode-scanner";
import { cn } from "@/lib/utils";
import { Routes } from "@/routes/routes";

const ScanPage: FC = () => {
    const navigate = useNavigate();
    const [manual_barcode, set_manual_barcode] = useState("");
    const lookup_mutation = useBarcodeLookup();
    const stop_scanner_ref = useRef<(() => void) | null>(null);
    const reset_processing_ref = useRef<(() => void) | null>(null);

    const submit_barcode = useCallback(
        (barcode: string) => {
            stop_scanner_ref.current?.();
            lookup_mutation.mutate(barcode, {
                onSettled: () => {
                    reset_processing_ref.current?.();
                },
            });
        },
        [lookup_mutation],
    );

    const {
        video_ref,
        status,
        error_message,
        start_scanner,
        stop_scanner,
        reset_processing,
    } = useBarcodeScanner(submit_barcode);

    stop_scanner_ref.current = stop_scanner;
    reset_processing_ref.current = reset_processing;

    useEffect(() => {
        void start_scanner();
        return () => {
            stop_scanner();
        };
    }, [start_scanner, stop_scanner]);

    const handle_manual_submit = (event: React.FormEvent) => {
        event.preventDefault();
        submit_barcode(manual_barcode);
    };

    const is_lookup_pending = lookup_mutation.isPending;

    return (
        <div className="mx-auto flex max-w-lg flex-col gap-6 pb-8">
            <div>
                <h1
                    className="text-2xl font-semibold text-foreground"
                    style={{ fontFamily: "var(--heading)" }}
                >
                    Scan
                </h1>
                <p className="mt-1 text-sm text-muted">
                    Point your camera at a barcode to check product safety.
                </p>
            </div>

            <Card className="relative overflow-hidden p-0">
                <div className="relative aspect-[4/3] bg-surface-secondary">
                    <video
                        ref={video_ref}
                        className={cn(
                            "h-full w-full object-cover",
                            (status === "permission_denied" ||
                                status === "unsupported" ||
                                status === "error") &&
                                "hidden",
                        )}
                        muted
                        playsInline
                    />
                    {(status === "permission_denied" ||
                        status === "unsupported" ||
                        status === "error") && (
                        <div className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center">
                            <Camera className="h-10 w-10 text-muted" />
                            <p className="text-sm text-muted">
                                {error_message ||
                                    "Camera unavailable. Use manual entry below."}
                            </p>
                        </div>
                    )}
                    {status === "scanning" ? (
                        <div className="pointer-events-none absolute inset-6 rounded-2xl border-2 border-accent/70" />
                    ) : null}
                    {is_lookup_pending ? (
                        <div className="absolute inset-0 flex items-center justify-center bg-background/70 backdrop-blur-sm">
                            <div className="flex flex-col items-center gap-2">
                                <ScanLine className="h-8 w-8 animate-pulse text-accent" />
                                <p className="text-sm font-medium text-foreground">
                                    Looking up product…
                                </p>
                            </div>
                        </div>
                    ) : null}
                </div>
            </Card>

            {status === "permission_denied" || status === "error" ? (
                <Button variant="outline" onClick={() => void start_scanner()}>
                    Try camera again
                </Button>
            ) : null}

            <form onSubmit={handle_manual_submit} className="grid gap-3">
                <div className="flex flex-col gap-1">
                    <label
                        htmlFor="manual-barcode"
                        className="text-sm font-medium text-foreground"
                    >
                        Enter barcode manually
                    </label>
                    <Input
                        id="manual-barcode"
                        inputMode="numeric"
                        placeholder="e.g. 1234567890123"
                        value={manual_barcode}
                        onChange={(event) =>
                            set_manual_barcode(event.target.value)
                        }
                    />
                </div>
                <Button
                    type="submit"
                    variant="scan"
                    loading={is_lookup_pending}
                    disabled={!manual_barcode.trim()}
                >
                    Look up barcode
                </Button>
            </form>

            <Button
                type="button"
                variant="ghost"
                onClick={() => navigate(Routes.products.create)}
            >
                Scan label instead
            </Button>
        </div>
    );
};

export default ScanPage;
