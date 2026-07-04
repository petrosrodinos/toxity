import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { App } from "@capacitor/app";
import { is_android_native } from "@/lib/camera";
import { Routes } from "@/routes/routes";

const ROOT_PATHS = new Set([
    Routes.history.root,
    Routes.scan.root,
    Routes.search.root,
    Routes.home.root,
    Routes.profile.root,
    Routes.admin.root,
]);

const AUTH_PATHS = Object.values(Routes.auth);

const is_auth_path = (pathname: string): boolean =>
    AUTH_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`));

export const useAndroidBackButton = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const location_ref = useRef(location);

    location_ref.current = location;

    useEffect(() => {
        if (!is_android_native()) {
            return;
        }

        let listener_handle: { remove: () => Promise<void> } | undefined;

        void App.addListener("backButton", () => {
            const pathname = location_ref.current.pathname;

            if (ROOT_PATHS.has(pathname) || is_auth_path(pathname)) {
                void App.exitApp();
                return;
            }

            navigate(-1);
        }).then((handle) => {
            listener_handle = handle;
        });

        return () => {
            void listener_handle?.remove();
        };
    }, [navigate]);
};
