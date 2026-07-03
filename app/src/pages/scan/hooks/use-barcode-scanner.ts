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
    const on_detect_ref = useRef(on_detect);
    const is_processing_ref = useRef(false);
    const is_running_ref = useRef(false);
    const [status, set_status] = useState<ScannerStatus>("idle");
    const [error_message, set_error_message] = useState<string | null>(null);

    on_detect_ref.current = on_detect;

    const stop_scanner = useCallback(() => {
        controls_ref.current?.stop();
        controls_ref.current = null;
        reader_ref.current = null;
        is_running_ref.current = false;

        const video = video_ref.current;
        if (video) {
            const stream = video.srcObject;
            if (stream instanceof MediaStream) {
                for (const track of stream.getTracks()) {
                    track.stop();
                }
            }
            video.srcObject = null;
        }
    }, []);

    const start_scanner = useCallback(async () => {
        if (!video_ref.current || is_processing_ref.current || is_running_ref.current) {
            return;
        }

        if (!navigator.mediaDevices?.getUserMedia) {
            set_status("unsupported");
            set_error_message("Camera access is not supported in this browser.");
            return;
        }

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
                    on_detect_ref.current(result.getText());
                },
            );

            controls_ref.current = controls;
            is_running_ref.current = true;
            set_status("scanning");
        } catch (error) {
            is_running_ref.current = false;

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
    }, [stop_scanner]);

    const reset_processing = useCallback(() => {
        is_processing_ref.current = false;
    }, []);

    useEffect(() => {
        void start_scanner();

        return () => {
            stop_scanner();
        };
    }, [start_scanner, stop_scanner]);

    return {
        video_ref,
        status,
        error_message,
        start_scanner,
        stop_scanner,
        reset_processing,
    };
};
