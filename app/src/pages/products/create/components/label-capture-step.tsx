import { type FC, useRef, useState } from "react";
import { Camera, ImagePlus, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    capture_photo_file,
    is_android_native,
    request_camera_permission,
} from "@/lib/camera";

type LabelCaptureStepProps = {
    step_label: string;
    title: string;
    description: string;
    tips: string[];
    is_uploading: boolean;
    on_capture: (file: File) => void;
};

const LabelCaptureStep: FC<LabelCaptureStepProps> = ({
    step_label,
    title,
    description,
    tips,
    is_uploading,
    on_capture,
}) => {
    const input_ref = useRef<HTMLInputElement>(null);
    const [preview_url, set_preview_url] = useState<string | null>(null);
    const [permission_error, set_permission_error] = useState<string | null>(null);

    const handle_file_selected = (file: File) => {
        set_permission_error(null);
        set_preview_url(URL.createObjectURL(file));
        on_capture(file);
    };

    const handle_capture_click = async () => {
        if (is_android_native()) {
            set_permission_error(null);

            const granted = await request_camera_permission();
            if (!granted) {
                set_permission_error(
                    "Camera access was denied. Enable it in app settings to take photos.",
                );
                return;
            }

            try {
                const file = await capture_photo_file();
                handle_file_selected(file);
            } catch {
                return;
            }

            return;
        }

        input_ref.current?.click();
    };

    const handle_file_change = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        handle_file_selected(file);
        event.target.value = "";
    };

    return (
        <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-accent">
                {step_label}
            </p>
            <div>
                <h1
                    className="text-2xl font-semibold text-foreground"
                    style={{ fontFamily: "var(--heading)" }}
                >
                    {title}
                </h1>
                <p className="mt-1 text-sm text-muted">{description}</p>
            </div>

            <Card className="overflow-hidden p-0">
                <div className="relative flex aspect-[4/3] items-center justify-center bg-surface-secondary">
                    {preview_url ? (
                        <img
                            src={preview_url}
                            alt={title}
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <div className="flex flex-col items-center gap-2 text-muted">
                            <Camera className="h-10 w-10" />
                            <p className="text-sm">No photo yet</p>
                        </div>
                    )}

                    {is_uploading ? (
                        <div className="absolute inset-0 flex items-center justify-center bg-background/70 backdrop-blur-sm">
                            <div className="flex flex-col items-center gap-2">
                                <Loader2 className="h-8 w-8 animate-spin text-accent" />
                                <p className="text-sm font-medium text-foreground">
                                    Uploading photo…
                                </p>
                            </div>
                        </div>
                    ) : null}
                </div>
            </Card>

            <ul className="space-y-1.5 text-sm text-muted">
                {tips.map((tip) => (
                    <li key={tip} className="flex items-start gap-2">
                        <span aria-hidden className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted" />
                        {tip}
                    </li>
                ))}
            </ul>

            {!is_android_native() ? (
                <input
                    ref={input_ref}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    onChange={handle_file_change}
                />
            ) : null}

            {permission_error ? (
                <p className="text-sm text-danger">{permission_error}</p>
            ) : null}

            <Button
                type="button"
                variant="scan"
                className="w-full"
                loading={is_uploading}
                onClick={() => void handle_capture_click()}
            >
                <ImagePlus className="h-4 w-4" />
                {preview_url ? "Retake Photo" : "Take Photo"}
            </Button>
        </div>
    );
};

export default LabelCaptureStep;
