import { Routes as ReactRoutes, Route, Navigate } from "react-router-dom";
import { Routes } from "@/routes/routes";
import ProtectedRoute from "@/routes/protected-route";
import { useAuthStore } from "@/stores/auth";
import { RoleTypes } from "@/features/user/interfaces/user.interface";
import SignIn from "@/pages/auth/pages/sign-in";
import SignUp from "@/pages/auth/pages/sign-up";
import ForgotPassword from "@/pages/auth/pages/forgot-password";
import ResetPassword from "@/pages/auth/pages/reset-password";
import AuthLayout from "@/pages/auth/layout";
import AppShell from "@/components/layout/app-shell";
import HomePage from "@/pages/home";
import ScanPage from "@/pages/scan";
import SearchPage from "@/pages/search";
import HistoryPage from "@/pages/history";
import ProfilePage from "@/pages/profile";
import IngredientDetailPage from "@/pages/ingredients/detail";
import ProductDetailPage from "@/pages/products/detail";
import ProductCreatePage from "@/pages/products/create";
import AdminPage from "@/pages/admin";
import LandingPage from "@/pages/landing";
import { is_native_platform } from "@/lib/platform";

function RootRedirect() {
    const { isLoggedIn } = useAuthStore();

    if (!isLoggedIn) {
        return <Navigate to={Routes.landing.root} replace />;
    }

    return (
        <Navigate
            to={is_native_platform() ? Routes.history.root : Routes.landing.root}
            replace
        />
    );
}

export default function AppRoutes() {
    return (
        <ReactRoutes>
            {/* Auth routes */}
            <Route
                path="/auth"
                element={
                    <ProtectedRoute loggedIn={false}>
                        <AuthLayout />
                    </ProtectedRoute>
                }
            >
                <Route path="sign-up" element={<SignUp />} />
                <Route path="sign-in" element={<SignIn />} />
                <Route path="forgot-password" element={<ForgotPassword />} />
                <Route path="reset-password" element={<ResetPassword />} />
                <Route index element={<Navigate to={Routes.auth.sign_in} replace />} />
            </Route>

            {/* App routes */}
            <Route
                element={
                    <ProtectedRoute loggedIn={true} fallbackPath={Routes.auth.sign_in}>
                        <AppShell />
                    </ProtectedRoute>
                }
            >
                <Route path={Routes.home.root} element={<HomePage />} />
                <Route path={Routes.scan.root} element={<ScanPage />} />
                <Route path={Routes.search.root} element={<SearchPage />} />
                <Route path={Routes.history.root} element={<HistoryPage />} />
                <Route path={Routes.profile.root} element={<ProfilePage />} />
                <Route
                    path={Routes.ingredients.detail(":ingredient_uuid")}
                    element={<IngredientDetailPage />}
                />
                <Route
                    path={Routes.products.detail(":product_uuid")}
                    element={<ProductDetailPage />}
                />
                <Route
                    path={Routes.products.create}
                    element={<ProductCreatePage />}
                />
                <Route
                    path={Routes.admin.root}
                    element={
                        <ProtectedRoute
                            loggedIn={true}
                            requiredRoles={[RoleTypes.ADMIN]}
                            fallbackPath={Routes.home.root}
                        >
                            <AdminPage />
                        </ProtectedRoute>
                    }
                />
            </Route>

            {/* Legacy dashboard redirects */}
            <Route path="/dashboard/profile" element={<Navigate to={Routes.profile.root} replace />} />
            <Route path="/dashboard" element={<Navigate to={Routes.home.root} replace />} />

            {/* Default redirect */}
            <Route path={Routes.landing.root} element={<LandingPage />} />

            {/* Catch all */}
            <Route path="*" element={<RootRedirect />} />
        </ReactRoutes>
    );
}
