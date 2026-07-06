import type { FC } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import {
    ScanLine,
    History,
    ShieldCheck,
    ArrowRight,
    Camera,
    FlaskConical,
} from "lucide-react";
import { useAuthStore } from "@/stores/auth";
import { is_native_platform } from "@/lib/platform";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SafetyBadge, ColorIndicators } from "@/components/ui/safety-badge";
import { Routes } from "@/routes/routes";
import { LandingHeader } from "./components/landing-header";
import { LandingHeroVisual } from "./components/landing-hero-visual";

const features = [
    {
        icon: ScanLine,
        title: "Scan in the aisle",
        body: "Point your camera at a barcode or photograph the ingredient label. Works when you are standing in front of the shelf.",
    },
    {
        icon: FlaskConical,
        title: "Plain-language breakdown",
        body: "Dense INCI lists become readable summaries — what each ingredient does and why it matters for your skin or diet.",
    },
    {
        icon: ShieldCheck,
        title: "Safety you can read",
        body: "Every score ships with a text label and color chip. No traffic-light guessing — just clear bands from very safe to high risk.",
    },
    {
        icon: History,
        title: "Your scan library",
        body: "History and favorites keep products you have checked close at hand for the next shopping trip.",
    },
] as const;

const steps = [
    { step: "01", label: "Scan", detail: "Barcode or label photo" },
    { step: "02", label: "Analyze", detail: "AI reads every ingredient" },
    { step: "03", label: "Decide", detail: "Scores plus context" },
] as const;

const LandingPage: FC = () => {
    const navigate = useNavigate();
    const { isLoggedIn } = useAuthStore();

    if (isLoggedIn && is_native_platform()) {
        return <Navigate to={Routes.history.root} replace />;
    }

    return (
        <div className="landing-page flex h-full min-h-0 flex-col bg-background">
            <LandingHeader />

            <main className="min-h-0 flex-1 overflow-y-auto">
                <section className="relative overflow-hidden border-b border-border/60">
                    <div
                        aria-hidden
                        className="landing-grid pointer-events-none absolute inset-0 opacity-[0.35]"
                    />
                    <div className="relative mx-auto grid max-w-6xl gap-12 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16 lg:py-24">
                        <div className="space-y-8">
                            <div className="landing-fade-up space-y-4">
                                <p className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-secondary/60 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.14em] text-accent">
                                    <Camera className="h-3.5 w-3.5" aria-hidden />
                                    Ingredient intelligence
                                </p>
                                <h1 className="max-w-xl text-4xl font-semibold leading-[1.08] tracking-tight text-foreground sm:text-5xl lg:text-[3.25rem]">
                                    Read any label like a{" "}
                                    <span className="text-accent">lab report</span>
                                </h1>
                                <p className="max-w-lg text-base leading-relaxed text-muted sm:text-lg">
                                    Toxity turns barcodes and ingredient lists into clear safety
                                    scores — so you can shop with confidence, not guesswork.
                                </p>
                            </div>

                            <div
                                className="landing-fade-up flex flex-col gap-3 sm:flex-row sm:items-center"
                                style={{ animationDelay: "120ms" }}
                            >
                                <Button
                                    variant="scan"
                                    className="h-11 px-6"
                                    onClick={() => navigate(Routes.auth.sign_up)}
                                >
                                    <ScanLine className="h-4 w-4" />
                                    Start scanning free
                                </Button>
                                <Button
                                    variant="outline"
                                    className="h-11"
                                    onClick={() => navigate(Routes.auth.sign_in)}
                                >
                                    I already have an account
                                </Button>
                            </div>

                            <div
                                className="landing-fade-up flex flex-wrap items-center gap-2"
                                style={{ animationDelay: "200ms" }}
                            >
                                <span className="mr-1 text-xs text-muted">Safety spectrum:</span>
                                {(
                                    [
                                        ColorIndicators.VERY_SAFE,
                                        ColorIndicators.SAFE,
                                        ColorIndicators.MODERATE,
                                        ColorIndicators.CAUTION,
                                        ColorIndicators.HIGH_RISK,
                                    ] as const
                                ).map((indicator) => (
                                    <SafetyBadge key={indicator} indicator={indicator} compact />
                                ))}
                            </div>
                        </div>

                        <LandingHeroVisual
                            className="landing-fade-up lg:justify-self-end"
                            style={{ animationDelay: "160ms" }}
                        />
                    </div>
                </section>

                <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
                    <div className="mb-10 max-w-2xl">
                        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent">
                            How it works
                        </p>
                        <h2 className="mt-2 text-2xl font-semibold text-foreground sm:text-3xl">
                            Three steps from shelf to answer
                        </h2>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-3">
                        {steps.map((item, index) => (
                            <Card
                                key={item.step}
                                className="landing-fade-up p-5"
                                style={{ animationDelay: `${index * 80}ms` }}
                            >
                                <p className="font-mono text-xs text-accent">{item.step}</p>
                                <p className="mt-2 text-lg font-semibold text-foreground">
                                    {item.label}
                                </p>
                                <p className="mt-1 text-sm text-muted">{item.detail}</p>
                            </Card>
                        ))}
                    </div>
                </section>

                <section className="border-y border-border/60 bg-surface-secondary/30">
                    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
                        <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                            <div className="max-w-xl">
                                <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent">
                                    Built for real shopping
                                </p>
                                <h2 className="mt-2 text-2xl font-semibold text-foreground sm:text-3xl">
                                    Calm, clinical, always legible
                                </h2>
                            </div>
                            <p className="max-w-sm text-sm text-muted">
                                Designed mobile-first for quick decisions in store — with the same
                                clarity on desktop when you are researching at home.
                            </p>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            {features.map((feature, index) => {
                                const Icon = feature.icon;
                                return (
                                    <Card
                                        key={feature.title}
                                        className="landing-fade-up p-5"
                                        style={{ animationDelay: `${index * 70}ms` }}
                                    >
                                        <div className="mb-4 inline-flex rounded-lg border border-border bg-surface-secondary p-2.5 text-accent">
                                            <Icon className="h-5 w-5" aria-hidden />
                                        </div>
                                        <h3 className="text-base font-semibold text-foreground">
                                            {feature.title}
                                        </h3>
                                        <p className="mt-2 text-sm leading-relaxed text-muted">
                                            {feature.body}
                                        </p>
                                    </Card>
                                );
                            })}
                        </div>
                    </div>
                </section>

                <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
                    <Card className="landing-fade-up overflow-hidden p-0">
                        <div className="grid lg:grid-cols-[1.2fr_0.8fr]">
                            <div className="space-y-5 p-6 sm:p-8 lg:p-10">
                                <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent">
                                    Ready when you are
                                </p>
                                <h2 className="text-2xl font-semibold text-foreground sm:text-3xl">
                                    Your next product is one scan away
                                </h2>
                                <p className="max-w-md text-sm leading-relaxed text-muted sm:text-base">
                                    Create a free account, scan your first barcode, and build a
                                    personal library of ingredient intelligence.
                                </p>
                                <div className="flex flex-col gap-3 sm:flex-row">
                                    <Button
                                        variant="scan"
                                        className="h-11"
                                        onClick={() => navigate(Routes.auth.sign_up)}
                                    >
                                        Create free account
                                        <ArrowRight className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="h-11"
                                        onClick={() => navigate(Routes.auth.sign_in)}
                                    >
                                        Sign in
                                    </Button>
                                </div>
                            </div>
                            <div className="relative hidden min-h-[220px] border-t border-border bg-surface-secondary/50 lg:block lg:border-l lg:border-t-0">
                                <div
                                    aria-hidden
                                    className="landing-glow absolute inset-0 opacity-50"
                                />
                                <div className="relative flex h-full flex-col justify-center gap-3 p-8">
                                    <SafetyBadge indicator={ColorIndicators.SAFE} />
                                    <SafetyBadge indicator={ColorIndicators.MODERATE} />
                                    <SafetyBadge indicator={ColorIndicators.CAUTION} />
                                    <p className="mt-2 font-mono text-xs text-muted">
                                        Reagent chips — never color alone
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Card>
                </section>

                <footer className="border-t border-border/60">
                    <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6">
                        <p>Toxity — AI-powered ingredient intelligence</p>
                        <div className="flex flex-wrap gap-4">
                            <button
                                type="button"
                                className="transition-colors hover:text-foreground"
                                onClick={() => navigate(Routes.auth.sign_in)}
                            >
                                Sign in
                            </button>
                            <button
                                type="button"
                                className="transition-colors hover:text-foreground"
                                onClick={() => navigate(Routes.auth.sign_up)}
                            >
                                Sign up
                            </button>
                        </div>
                    </div>
                </footer>
            </main>
        </div>
    );
};

export default LandingPage;
