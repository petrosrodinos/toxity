import { useCallback, useEffect, useState } from "react";
import { is_ios_browser, is_native_platform, is_standalone_display } from "@/lib/platform";

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function usePwaInstall() {
    const [install_event, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
    const [is_installed, setIsInstalled] = useState(() => is_standalone_display());
    const [is_installing, setIsInstalling] = useState(false);

    useEffect(() => {
        if (is_native_platform()) {
            return;
        }

        const sync_installed_state = () => {
            setIsInstalled(is_standalone_display());
        };

        const on_before_install = (event: Event) => {
            event.preventDefault();
            setInstallEvent(event as BeforeInstallPromptEvent);
        };

        const on_app_installed = () => {
            setIsInstalled(true);
            setInstallEvent(null);
        };

        sync_installed_state();
        window.addEventListener("beforeinstallprompt", on_before_install);
        window.addEventListener("appinstalled", on_app_installed);
        window.matchMedia("(display-mode: standalone)").addEventListener("change", sync_installed_state);

        return () => {
            window.removeEventListener("beforeinstallprompt", on_before_install);
            window.removeEventListener("appinstalled", on_app_installed);
            window.matchMedia("(display-mode: standalone)").removeEventListener("change", sync_installed_state);
        };
    }, []);

    const install = useCallback(async () => {
        if (!install_event) {
            return false;
        }

        setIsInstalling(true);

        try {
            await install_event.prompt();
            const { outcome } = await install_event.userChoice;

            if (outcome === "accepted") {
                setIsInstalled(true);
                setInstallEvent(null);
                return true;
            }

            return false;
        } finally {
            setIsInstalling(false);
        }
    }, [install_event]);

    const can_show_install =
        !is_native_platform() && !is_installed && (Boolean(install_event) || is_ios_browser());

    return {
        can_show_install,
        can_prompt_install: Boolean(install_event),
        show_ios_instructions: can_show_install && is_ios_browser() && !install_event,
        show_android_manual_instructions: can_show_install && !install_event && !is_ios_browser(),
        is_installed,
        is_installing,
        install,
    };
}
