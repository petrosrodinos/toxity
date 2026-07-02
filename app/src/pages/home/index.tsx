import { ScanLine, Lightbulb } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/auth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Routes } from "@/routes/routes";
import { useGetHomeFeed } from "@/features/home/hooks/use-home";
import HomeSection from "./components/home-section";
import CategoryChips from "./components/category-chips";
import IngredientSpotlightCard from "./components/ingredient-spotlight-card";

export default function HomePage() {
    const navigate = useNavigate();
    const { full_name, email } = useAuthStore();
    const display_name = full_name || email || "there";
    const { data, isLoading } = useGetHomeFeed();

    return (
        <div className="space-y-6 pb-8">
            <Card className="p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-foreground">
                            Welcome back, {display_name}
                        </h1>
                        <p className="mt-1 text-sm text-muted">
                            Scan a product to see AI-powered ingredient analysis and
                            safety insights.
                        </p>
                    </div>
                    <Button
                        variant="scan"
                        className="w-full shrink-0 sm:w-auto"
                        onClick={() => navigate(Routes.scan.root)}
                    >
                        <ScanLine className="h-4 w-4" />
                        Scan product
                    </Button>
                </div>
            </Card>

            {isLoading ? (
                <Card className="space-y-2 p-5">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-4 w-full" />
                </Card>
            ) : data?.daily_tip ? (
                <Card className="space-y-1.5 p-5">
                    <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-accent">
                        <Lightbulb className="h-3.5 w-3.5" />
                        Daily tip
                    </p>
                    <p className="text-sm font-medium text-foreground">
                        {data.daily_tip.title}
                    </p>
                    <p className="text-sm text-muted">{data.daily_tip.body}</p>
                </Card>
            ) : null}

            <HomeSection
                title="Continue scanning"
                description="Pick up where you left off"
                items={data?.continue_scanning}
                is_loading={isLoading}
            />

            <CategoryChips categories={data?.categories} is_loading={isLoading} />

            <HomeSection
                title="Trending products"
                description="Popular in the community"
                items={data?.trending}
                is_loading={isLoading}
                empty_message="Scan a few products to help us build trending picks."
            />

            <HomeSection
                title="Top rated"
                description="Highest ingredient safety scores"
                items={data?.highest_rated}
                is_loading={isLoading}
                empty_message="No rated products yet."
            />

            <IngredientSpotlightCard
                ingredient={data?.ingredient_spotlight?.ingredient}
                is_loading={isLoading}
            />

            <HomeSection
                title="New products"
                description="Freshly analyzed by our AI"
                items={data?.new_products}
                is_loading={isLoading}
                empty_message="No new products yet."
            />

            <HomeSection
                title="Recommended for you"
                items={data?.recommended}
                is_loading={isLoading}
                empty_message="Nothing recommended yet."
            />
        </div>
    );
}
