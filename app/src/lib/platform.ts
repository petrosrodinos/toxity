import { Capacitor } from "@capacitor/core";
import { Routes } from "@/routes/routes";

export const is_native_platform = (): boolean => Capacitor.isNativePlatform();

export function get_app_logo_route(): string {
    return is_native_platform() ? Routes.history.root : Routes.landing.root;
}

export const is_ios_browser = (): boolean => {
    if (typeof navigator === "undefined") {
        return false;
    }

    return /iPad|iPhone|iPod/.test(navigator.userAgent);
};

export const is_standalone_display = (): boolean => {
    if (typeof window === "undefined") {
        return false;
    }

    const navigator_with_standalone = window.navigator as Navigator & { standalone?: boolean };

    return (
        window.matchMedia("(display-mode: standalone)").matches ||
        window.matchMedia("(display-mode: fullscreen)").matches ||
        navigator_with_standalone.standalone === true
    );
};
