import type { FC } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { Routes } from "@/routes/routes";
import { useCreationWizard } from "./hooks/use-creation-wizard";
import LabelCaptureStep from "./components/label-capture-step";
import AnalysisProgressStep from "./components/analysis-progress-step";
import CreationErrorState from "./components/creation-error-state";

const ProductCreatePage: FC = () => {
    const [search_params] = useSearchParams();
    const barcode = search_params.get("barcode");

    const {
        step,
        processing_phase,
        error_message,
        ingredient_count,
        is_uploading_ingredient_label,
        is_uploading_front_label,
        handle_ingredient_label,
        handle_front_label,
        start_over,
    } = useCreationWizard(barcode);

    return (
        <div className="mx-auto max-w-lg space-y-6 pb-8">
            <div className="flex items-center gap-3">
                <Link
                    to={Routes.scan.root}
                    aria-label="Back to scan"
                    className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-foreground transition-colors hover:bg-surface-secondary"
                >
                    <ArrowLeft className="h-4 w-4" />
                </Link>
                {barcode ? (
                    <p className="text-sm text-muted">
                        Barcode <span className="font-mono">{barcode}</span> was not
                        recognized. Let's add it.
                    </p>
                ) : (
                    <p className="text-sm text-muted">Add a new product</p>
                )}
            </div>

            {step === "initializing" ? (
                <div className="flex flex-col items-center gap-3 py-16 text-muted">
                    <Loader2 className="h-8 w-8 animate-spin text-accent" />
                    <p className="text-sm">Preparing product creation…</p>
                </div>
            ) : null}

            {step === "ingredient_label" ? (
                <LabelCaptureStep
                    step_label="Step 1 of 3"
                    title="Photograph the ingredient list"
                    description="Find the full ingredient list on the packaging (usually on the back or bottom)."
                    tips={[
                        "Make sure all text is in focus and well lit",
                        "Flatten the label if it's curved on a bottle",
                        "Avoid glare and shadows over the text",
                    ]}
                    is_uploading={is_uploading_ingredient_label}
                    on_capture={handle_ingredient_label}
                />
            ) : null}

            {step === "front_label" ? (
                <LabelCaptureStep
                    step_label="Step 2 of 3"
                    title="Photograph the front label"
                    description="Capture the front of the package showing the product name and brand."
                    tips={[
                        "Center the product name and brand logo",
                        "Include the package size if visible",
                    ]}
                    is_uploading={is_uploading_front_label}
                    on_capture={handle_front_label}
                />
            ) : null}

            {step === "processing" ? (
                <AnalysisProgressStep
                    phase={processing_phase}
                    ingredient_count={ingredient_count}
                />
            ) : null}

            {step === "failed" ? (
                <CreationErrorState
                    error_message={
                        error_message ?? "Something went wrong. Please try again."
                    }
                    on_retry={start_over}
                />
            ) : null}
        </div>
    );
};

export default ProductCreatePage;
