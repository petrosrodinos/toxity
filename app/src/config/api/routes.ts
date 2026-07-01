export const ApiRoutes = {
    auth: {
        email: {
            login: "/auth/email/login",
            register: "/auth/email/register",
            admin_login_to_account: (account_uuid: string) => `/auth/email/${account_uuid}/admin-login`,
            forgot_password: "/auth/email/forgot-password",
            reset_password: "/auth/email/reset-password",
        },
    },
    users: {
        prefix: "/users",
        me: "/users/me",
    },
    google_maps: {
        timezone: "/google-maps/timezone",
    },
}