export const Routes = {
    auth: {
        sign_in: "/auth/sign-in",
        sign_up: "/auth/sign-up",
        forgot_password: "/auth/forgot-password",
        reset_password: "/auth/reset-password",
    },
    home: {
        root: "/home",
    },
    scan: {
        root: "/scan",
    },
    search: {
        root: "/search",
        by_category: (category_uuid: string) =>
            `/search?category_uuid=${encodeURIComponent(category_uuid)}`,
    },
    history: {
        root: "/history",
    },
    profile: {
        root: "/profile",
    },
    admin: {
        root: "/admin",
    },
    ingredients: {
        detail: (ingredient_uuid: string) => `/ingredients/${ingredient_uuid}`,
    },
    products: {
        detail: (product_uuid: string) => `/products/${product_uuid}`,
        create: "/products/create",
        create_with_barcode: (barcode: string) =>
            `/products/create?barcode=${encodeURIComponent(barcode)}`,
    },
};
