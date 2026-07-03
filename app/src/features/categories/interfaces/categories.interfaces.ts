export type Subcategory = {
    uuid: string;
    name: string;
    slug: string;
    sort_order: number;
};

export type Category = {
    uuid: string;
    name: string;
    slug: string;
    icon_url?: string | null;
    sort_order: number;
    subcategories: Subcategory[];
};

export type CreateCategoryDto = {
    name: string;
    icon_url?: string;
    sort_order?: number;
};

export type UpdateCategoryDto = {
    name?: string;
    icon_url?: string;
    sort_order?: number;
};

export type CreateSubcategoryDto = {
    category_uuid: string;
    name: string;
    sort_order?: number;
};

export type UpdateSubcategoryDto = {
    category_uuid?: string;
    name?: string;
    sort_order?: number;
};
