import { type FC, useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { ProcessingPhase } from "../hooks/use-creation-wizard";

const EDUCATIONAL_TIPS = [
    "Cross-referencing ingredients with our safety database…",
    "Checking for common irritants and allergens…",
    "Calculating a personalized safety score…",
    "Reviewing environmental and cruelty-free claims…",
    "Finalizing your product safety report…",
];

const TIP_ROTATION_MS = 3200;

type AnalysisProgressStepProps = {
    phase: ProcessingPhase;
    ingredient_count: number | null;
};

const phase_label = (phase: ProcessingPhase, ingredient_count: number | null) => {
    switch (phase) {
        case "ocr":
            return "Extracting text from your photos…";
        case "starting":
            return "Starting AI safety analysis…";
        case "analyzing":
            return ingredient_count
                ? `Analyzing ${ingredient_count} ingredient${ingredient_count === 1 ? "" : "s"}…`
                : "Analyzing ingredients…";
        default:
            return "Working on it…";
    }
};

const AnalysisProgressStep: FC<AnalysisProgressStepProps> = ({
    phase,
    ingredient_count,
}) => {
    const [tip_index, set_tip_index] = useState(0);

    useEffect(() => {
        const interval = window.setInterval(() => {
            set_tip_index((index) => (index + 1) % EDUCATIONAL_TIPS.length);
        }, TIP_ROTATION_MS);

        return () => window.clearInterval(interval);
    }, []);

    return (
        <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-accent">
                Step 3 of 3
            </p>
            <div>
                <h1
                    className="text-2xl font-semibold text-foreground"
                    style={{ fontFamily: "var(--heading)" }}
                >
                    Analyzing your product
                </h1>
                <p className="mt-1 text-sm text-muted">
                    This usually takes 10–30 seconds. Don't close this screen.
                </p>
            </div>

            <Card className="flex flex-col items-center gap-4 p-8 text-center">
                <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
                    <Sparkles className="h-7 w-7 animate-pulse text-accent" />
                </div>
                <p className="text-sm font-medium text-foreground">
                    {phase_label(phase, ingredient_count)}
                </p>
                <p className="text-sm text-muted">{EDUCATIONAL_TIPS[tip_index]}</p>
            </Card>
        </div>
    );
};

export default AnalysisProgressStep;
