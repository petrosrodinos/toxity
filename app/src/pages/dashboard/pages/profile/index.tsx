import type { FC } from "react";
import { Card } from "@/components/ui/card";
import { ProfileSettingsForm } from "./components/profile-settings-form";

const ProfileSettingsPage: FC = () => {
    return (
        <div className="mx-auto max-w-2xl space-y-6">
            <div>
                <h1 className="text-2xl font-semibold text-foreground">Profile</h1>
                <p className="text-sm text-muted mt-1">Update how your name appears in the app</p>
            </div>

            <Card className="p-6">
                <ProfileSettingsForm />
            </Card>
        </div>
    );
};

export default ProfileSettingsPage;
