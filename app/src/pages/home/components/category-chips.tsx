import type { FC } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Routes } from "@/routes/routes";
import type { HomeCategory } from "@/features/home/interfaces/home.interfaces";

type CategoryChipsProps = {
    categories: HomeCategory[] | undefined;
    is_loading: boolean;
};

const CategoryChips: FC<CategoryChipsProps> = ({ categories, is_loading }) => {
    const navigate = useNavigate();

    if (!is_loading && (!categories || categories.length === 0)) {
        return null;
    }

    return (
        <section className="space-y-3">
            <h2
                className="text-lg font-semibold text-foreground"
                style={{ fontFamily: "var(--heading)" }}
            >
                Browse categories
            </h2>
            <div className="flex gap-2 overflow-x-auto pb-1">
                {is_loading
                    ? Array.from({ length: 4 }).map((_, index) => (
                          <Skeleton key={index} className="h-9 w-24 shrink-0 rounded-xl" />
                      ))
                    : categories?.map((category) => (
                          <Button
                              key={category.uuid}
                              type="button"
                              variant="outline"
                              className="shrink-0"
                              onClick={() =>
                                  navigate(Routes.search.by_category(category.uuid))
                              }
                          >
                              {category.name}
                          </Button>
                      ))}
            </div>
        </section>
    );
};

export default CategoryChips;
