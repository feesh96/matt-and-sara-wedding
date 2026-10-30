export type StoryMotion = "gentle" | "characters";
export type StoryLayout = "book" | "scroll";

export type StoryChapter = {
  id: string;
  title: string;
  place: string;
  numeral: string;
  text: string;
  opening: string;
  emphasis?: string;
  description: string;
  atmosphere: "candles" | "wine" | "music" | "leaves";
};

export const storyChapters: readonly StoryChapter[] = [
  {
    id: "blacksburg",
    title: "Blacksburg",
    place: "Virginia",
    numeral: "I",
    opening: "Matt and Sara’s",
    text: "Matt and Sara’s story began in Blacksburg, Virginia. Both engineering students at Virginia Tech, they found something familiar in each other. Over Shabbat dinners at Chabad and through a shared circle of friends, that familiarity grew into friendship. Neither knew then how much more of life they’d eventually share.",
    description: "A watercolor of Matt and Sara sharing Shabbat dinner with friends in Blacksburg, with candles and challah on the table.",
    atmosphere: "candles",
  },
  {
    id: "new-york",
    title: "New York City",
    place: "Vin Sur Vingt",
    numeral: "II",
    opening: "A few years later,",
    text: "A few years later, mutual friends brought them back into each other’s lives in New York City (you know who you are). In a new place, a familiar friendship began to feel like something more. After months of insisting they were just friends, they finally went on their first date at Vin Sur Vingt, a little wine bar in the East Village.",
    emphasis: "just friends",
    description: "A watercolor of Matt and Sara on their first date, seated across from one another in a candlelit New York wine bar.",
    atmosphere: "wine",
  },
  {
    id: "home",
    title: "A Home Together",
    place: "Above the wine bar",
    numeral: "III",
    opening: "Fast forward",
    text: "Fast forward a couple of adventure-filled years: Matt and Sara moved into their first apartment together, coincidentally located directly above the wine bar where they had their first date. Between evenings with friends, new restaurants and recipes, and subconsciously singing to each other throughout the day, they found that even the most ordinary days were better together.",
    description: "A watercolor of Matt and Sara singing to each other in their cozy apartment above the wine bar.",
    atmosphere: "music",
  },
  {
    id: "kyoto",
    title: "Kyoto",
    place: "Japan · December 2025",
    numeral: "IV",
    opening: "In December of 2025,",
    text: "In December of 2025, Matt asked Sara to marry him in the gardens of Daigo-ji in Kyoto, Japan. With a lifetime of ordinary days and extraordinary adventures still ahead, they look forward to beginning their marriage surrounded by the people they love, all of you.",
    description: "A watercolor of Matt proposing to Sara in a garden in front of a five-story Japanese pagoda, surrounded by soft green and golden foliage.",
    atmosphere: "leaves",
  },
];
