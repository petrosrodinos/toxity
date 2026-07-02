export interface DailyTip {
    title: string;
    body: string;
}

export const DAILY_TIPS: DailyTip[] = [
    {
        title: 'Check the first five ingredients',
        body: "Ingredients are listed by concentration — the first five typically make up most of the product.",
    },
    {
        title: 'Fragrance can hide dozens of chemicals',
        body: '"Fragrance" or "parfum" on a label can represent a mix of undisclosed compounds. Look for fragrance-free options if you have sensitive skin.',
    },
    {
        title: "Vegan doesn't always mean cruelty-free",
        body: 'A product can be vegan (no animal-derived ingredients) yet still be tested on animals. Check both claims separately.',
    },
    {
        title: 'Comedogenic ratings help prevent breakouts',
        body: "Ingredients rated 3+ on the comedogenic scale are more likely to clog pores — useful to know if you're acne-prone.",
    },
    {
        title: "Natural doesn't mean safe",
        body: 'Some natural ingredients like essential oils can still cause irritation or allergic reactions. Always check the safety notes.',
    },
    {
        title: 'Patch test new products',
        body: 'Apply a small amount to your inner arm and wait 24-48 hours before using a new product on your face.',
    },
    {
        title: 'SPF matters year-round',
        body: 'UV exposure happens even on cloudy days — daily SPF helps prevent long-term skin damage.',
    },
];

export const getDailyTip = (date: Date = new Date()): DailyTip => {
    const start_of_year = new Date(date.getFullYear(), 0, 0).getTime();
    const day_of_year = Math.floor((date.getTime() - start_of_year) / 86_400_000);

    return DAILY_TIPS[day_of_year % DAILY_TIPS.length];
};
