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
    ingredients: {
        prefix: "/ingredients",
        by_uuid: (ingredient_uuid: string) => `/ingredients/${ingredient_uuid}`,
    },
    products: {
        prefix: "/products",
        by_barcode: (barcode: string) =>
            `/products/barcode/${encodeURIComponent(barcode)}`,
        by_uuid: (product_uuid: string) => `/products/${product_uuid}`,
    },
    scans: {
        prefix: "/scans",
        recent: "/scans/recent",
    },
    home: {
        root: "/home",
    },
    search: {
        root: "/search",
    },
    brands: {
        prefix: "/brands",
        by_uuid: (brand_uuid: string) => `/brands/${brand_uuid}`,
    },
    favorites: {
        prefix: "/favorites",
        check: "/favorites/check",
        by_uuid: (favorite_uuid: string) => `/favorites/${favorite_uuid}`,
    },
    product_creation: {
        jobs: "/product-creation/jobs",
        job_by_uuid: (job_uuid: string) => `/product-creation/jobs/${job_uuid}`,
        ingredient_label: (job_uuid: string) =>
            `/product-creation/jobs/${job_uuid}/ingredient-label`,
        front_label: (job_uuid: string) =>
            `/product-creation/jobs/${job_uuid}/front-label`,
        analyze: (job_uuid: string) =>
            `/product-creation/jobs/${job_uuid}/analyze`,
        start_analysis: (job_uuid: string) =>
            `/product-creation/jobs/${job_uuid}/start-analysis`,
    },
    google_maps: {
        timezone: "/google-maps/timezone",
    },
    admin: {
        products: {
            pending: "/admin/products/pending",
            merge: "/admin/products/merge",
            verify: (product_uuid: string) => `/admin/products/${product_uuid}/verify`,
            feature: (product_uuid: string) => `/admin/products/${product_uuid}/feature`,
            reanalyze: (product_uuid: string) => `/admin/products/${product_uuid}/reanalyze`,
            versions: (product_uuid: string) => `/admin/products/${product_uuid}/versions`,
        },
        ingredients: {
            merge: "/admin/ingredients/merge",
            reanalyze: (ingredient_uuid: string) =>
                `/admin/ingredients/${ingredient_uuid}/reanalyze`,
            versions: (ingredient_uuid: string) =>
                `/admin/ingredients/${ingredient_uuid}/versions`,
        },
        brands: {
            merge: "/admin/brands/merge",
        },
    },
}