import { useState, type FC } from "react";
import { Button } from "@/components/ui/button";
import { AllProductsTable } from "./components/all-products-table";
import { CategoriesTable } from "./components/categories-table";
import { MergeTool } from "./components/merge-tool";

const ADMIN_TABS = [
    { value: "products", label: "Products" },
    { value: "categories", label: "Categories" },
    { value: "merge", label: "Merge Duplicates" },
] as const;

type AdminTab = (typeof ADMIN_TABS)[number]["value"];

const AdminPage: FC = () => {
    const [tab, set_tab] = useState<AdminTab>("products");

    return (
        <div className="mx-auto max-w-4xl space-y-6 pb-8">
            <div>
                <h1
                    className="text-2xl font-semibold text-foreground"
                    style={{ fontFamily: "var(--heading)" }}
                >
                    Admin
                </h1>
                <p className="mt-1 text-sm text-muted">
                    Manage products and their ingredients, and clean up duplicate
                    records.
                </p>
            </div>

            <div className="flex flex-wrap gap-2">
                {ADMIN_TABS.map((option) => (
                    <Button
                        key={option.value}
                        type="button"
                        variant={tab === option.value ? "default" : "outline"}
                        onClick={() => set_tab(option.value)}
                    >
                        {option.label}
                    </Button>
                ))}
            </div>

            {tab === "products" && <AllProductsTable />}
            {tab === "categories" && <CategoriesTable />}
            {tab === "merge" && <MergeTool />}
        </div>
    );
};

export default AdminPage;
