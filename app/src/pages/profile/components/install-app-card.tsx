import type { FC } from "react";
import { Download, Share, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { usePwaInstall } from "@/hooks/use-pwa-install";

export const InstallAppCard: FC = () => {
    const {
        can_show_install,
        can_prompt_install,
        show_ios_instructions,
        show_android_manual_instructions,
        is_installing,
        install,
    } = usePwaInstall();

    if (!can_show_install) {
        return null;
    }

    return (
        <Card className="p-6">
            <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/15 text-accent">
                    <Smartphone className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground">Install Toxity</p>
                    <p className="mt-1 text-xs text-muted">
                        Add Toxity to your home screen for quick access, full-screen use, and faster
                        launch.
                    </p>

                    {show_ios_instructions ? (
                        <ol className="mt-4 space-y-2 text-xs text-muted">
                            <li className="flex items-start gap-2">
                                <Share className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" />
                                <span>Tap Share in Safari</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <Download className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" />
                                <span>Select Add to Home Screen, then tap Add</span>
                            </li>
                        </ol>
                    ) : null}

                    {show_android_manual_instructions ? (
                        <p className="mt-4 text-xs text-muted">
                            Open your browser menu and choose Install app or Add to Home screen.
                        </p>
                    ) : null}

                    {can_prompt_install ? (
                        <Button className="mt-4" loading={is_installing} onClick={() => void install()}>
                            <Download className="h-4 w-4" />
                            Install app
                        </Button>
                    ) : null}
                </div>
            </div>
        </Card>
    );
};
