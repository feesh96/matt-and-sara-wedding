export type CoupleImage = {
  src: string;
  alt: string;
  position: "primary" | "secondary";
};

export type Hotel = {
  name: string;
  description: string;
  image: string | null;
  imageAlt: string;
  bookingUrl: string;
};

const hotels = [
  {
    name: "The Nassau Inn",
    description: "Historic inn established in 1756",
    image: "/images/hotel-nassau-inn-sketch.png",
    imageAlt: "Architectural sketch of the Nassau Inn",
    bookingUrl: "https://reservations.travelclick.com/13522?groupID=5358089",
  },
  {
    name: "The Graduate by Hilton",
    description: "Modern hotel with contemporary accommodations",
    image: "/images/hotel-graduate-sketch.png",
    imageAlt: "Architectural sketch of the Graduate by Hilton in Princeton",
    bookingUrl:
      "https://www.hilton.com/en/book/reservation/deeplink/?ctyhocn=PCTGPGU&groupCode=GRPSAC&arrivaldate=2027-05-29&departuredate=2027-05-31&cid=OM,WW,HILTONLINK,EN,DirectLink&fromId=HILTONLINKDIRECT",
  },
] as const satisfies readonly Hotel[];

export const site = {
  phase: "save-the-date",
  couple: {
    displayNames: "Sara & Matt",
    formalNames: "Sara & Matthew",
  },
  wedding: {
    dateIso: "2027-05-30",
    date: "May 30, 2027",
    day: "Sunday",
    city: "Princeton, New Jersey",
    venue: "TPC Jasna Polana",
  },
  media: {
    hero: "/images/venue-gates.png",
    couple: [
      {
        src: "/images/couple-engagement-portrait.jpeg",
        alt: "Sara and Matt seated together during their engagement trip in Kyoto",
        position: "primary",
      },
      {
        src: "/images/couple-sunset-walk.jpeg",
        alt: "Sara and Matt holding hands while walking together at sunset",
        position: "secondary",
      },
    ] as const satisfies readonly CoupleImage[],
  },
  travel: {
    accommodations:
      "We have reserved room blocks at two hotels in the heart of downtown Princeton. The hotels are a three-minute walk from one another and approximately an 11-minute drive from TPC Jasna Polana. Shuttle transportation will be provided between the hotels and the venue on the wedding day.",
    hotels,
  },
  navigation: [
    { href: "/", label: "Home" },
    { href: "/schedule", label: "Schedule" },
    { href: "/travel", label: "Travel" },
    { href: "/faq", label: "FAQ" },
  ],
} as const;
