import { useCallback, useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";

type ScannerStatus =
    | "idle"
    | "starting"
    | "scanning"
    | "permission_denied"
    | "unsupported"
    | "error";

export const useBarcodeScanner = (on_detect: (barcode: string) => void) => {
    const video_ref = useRef<HTMLVideoElement>(null);
    const reader_ref = useRef<BrowserMultiFormatReader | null>(null);
    const controls_ref = useRef<{ stop: () => void } | null>(null);
    const [status, set_status] = useState<ScannerStatus>("idle");
    const [error_message, set_error_message] = useState<string | null>(null);
    const is_processing_ref = useRef(false);

    const stop_scanner = useCallback(() => {
        controls_ref.current?.stop();
        controls_ref.current = null;
        reader_ref.current = null;
    }, []);

    const start_scanner = useCallback(async () => {
        if (!video_ref.current || is_processing_ref.current) {
            return;
        }

        if (!navigator.mediaDevices?.getUserMedia) {
            set_status("unsupported");
            set_error_message("Camera access is not supported in this browser.");
            return;
        }

        stop_scanner();
        set_status("starting");
        set_error_message(null);

        try {
            const reader = new BrowserMultiFormatReader();
            reader_ref.current = reader;

            const controls = await reader.decodeFromVideoDevice(
                undefined,
                video_ref.current,
                (result) => {
                    if (!result || is_processing_ref.current) {
                        return;
                    }

                    is_processing_ref.current = true;
                    stop_scanner();
                    on_detect(result.getText());
                },
            );

            controls_ref.current = controls;
            set_status("scanning");
        } catch (error) {
            const message =
                error instanceof Error ? error.message : "Could not start camera.";

            if (
                message.toLowerCase().includes("permission") ||
                message.toLowerCase().includes("notallowed")
            ) {
                set_status("permission_denied");
                set_error_message(
                    "Camera access was denied. Enter the barcode manually below.",
                );
                return;
            }

            set_status("error");
            set_error_message(message);
        }
    }, [on_detect, stop_scanner]);

    const reset_processing = useCallback(() => {
        is_processing_ref.current = false;
    }, []);

    useEffect(() => {
        return () => {
            stop_scanner();
        };
    }, [stop_scanner]);

    return {
        video_ref,
        status,
        error_message,
        start_scanner,
        stop_scanner,
        reset_processing,
    };
};
