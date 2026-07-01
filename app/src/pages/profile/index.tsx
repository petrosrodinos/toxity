import type { FC } from "react";
import { LogOut } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProfileSettingsForm } from "./components/profile-settings-form";
import { useAuthStore } from "@/stores/auth";

const ProfilePage: FC = () => {
    const { logout } = useAuthStore();

    return (
        <div className="mx-auto max-w-2xl space-y-6">
            <div>
                <h1 className="text-2xl font-semibold text-foreground">Profile</h1>
                <p className="text-sm text-muted mt-1">Update how your name appears in the app</p>
            </div>

            <Card className="p-6">
                <ProfileSettingsForm />
            </Card>

            <Card className="p-6 lg:hidden">
                <p className="text-sm font-medium text-foreground">Account</p>
                <p className="mt-1 text-xs text-muted">Sign out of Toxity on this device.</p>
                <Button variant="outline" className="mt-4 text-danger border-danger/30 hover:bg-danger/10" onClick={logout}>
                    <LogOut className="h-4 w-4" />
                    Log out
                </Button>
            </Card>
        </div>
    );
};

export default ProfilePage;
