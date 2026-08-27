export type NavigationItem =
  | {
      label: string;
      side: "left" | "right";
      href: string;
      pending?: false;
    }
  | {
      label: string;
      side: "left" | "right";
      pending: true;
    };

export type Hotel = {
  name: string;
  description: string;
  image: string;
  imageAlt: string;
  bookingUrl: string;
};

const navigation: readonly NavigationItem[] = [
  { label: "Home", side: "left", href: "/" },
  { label: "Schedule", side: "left", href: "/schedule" },
  { label: "Travel", side: "left", href: "/travel" },
  { label: "Registry", side: "right", pending: true },
  { label: "FAQs", side: "right", href: "/faq" },
  { label: "RSVP", side: "right", href: "/rsvp" },
];

const hotels = [
  {
    name: "The Nassau Inn",
    description:
      "A historic Princeton landmark overlooking Palmer Square, offering timeless charm and an authentic boutique inn experience.",
    image: "/images/hotel-nassau-inn-sketch.png",
    imageAlt: "Architectural sketch of the Nassau Inn",
    bookingUrl: "https://reservations.travelclick.com/13522?groupID=5358089",
  },
  {
    name: "The Graduate by Hilton",
    description:
      "A modern hotel with contemporary accommodations, located just a short walk from Palmer Square.",
    image: "/images/hotel-graduate-sketch.png",
    imageAlt: "Architectural sketch of the Graduate by Hilton in Princeton",
    bookingUrl:
      "https://www.hilton.com/en/book/reservation/deeplink/?ctyhocn=PCTGPGU&groupCode=GRPSAC&arrivaldate=2027-05-29&departuredate=2027-05-31&cid=OM,WW,HILTONLINK,EN,DirectLink&fromId=HILTONLINKDIRECT",
  },
] as const satisfies readonly Hotel[];

export const site = {
  couple: {
    displayNames: "Sara & Matt",
  },
  wedding: {
    dateIso: "2027-05-30",
    date: "May 30, 2027",
    day: "Sunday",
    city: "Princeton, New Jersey",
    venue: "TPC Jasna Polana",
    address: "4519 Province Line Rd, Princeton, NJ 08540",
    mapsUrl:
      "https://www.google.com/maps/place/TPC+Jasna+Polana/@40.3327035,-74.6921165,17z/data=!3m1!4b1!4m6!3m5!1s0x89c3e3fcab3b45b7:0xced0c7e5d733a46f!8m2!3d40.3327035!4d-74.6921165!16zL20vMGIxbWs0?entry=ttu&g_ep=EgoyMDI2MDgyNC4wIKXMDSoASAFQAw%3D%3D",
  },
  media: {
    gates: "/images/venue-gates.png",
    pagodaTower: "/images/pagoda-tower.jpeg",
    holdingHands: "/images/holding-hands.jpeg",
    aerial: "/images/jasna-polana-aerial.jpg",
  },
  travel: {
    accommodations:
      "We have reserved room blocks at two hotels in the heart of downtown Princeton. The hotels are a three-minute walk from one another and approximately an 11-minute drive from TPC Jasna Polana. Shuttle transportation will be provided between the hotels and the venue on the wedding day.",
    hotels,
  },
  faqs: [
    {
      question: "Will I receive a formal invitation?",
      answer:
        "Yes. Formal invitations with RSVP information and additional wedding details will be sent closer to the wedding.",
    },
    {
      question: "Will there be additional events?",
      answer:
        "Yes! We are planning a few additional celebrations throughout the weekend. Details about these events and guest invitations will be shared closer to the wedding.",
    },
    {
      question: "Who is invited?",
      answer:
        "Your Save the Date and formal invitation will be addressed to the guests invited to celebrate with us. If you have any questions, please feel free to reach out to us.",
    },
    {
      question: "What if I have more questions?",
      answer:
        "Feel free to reach out to us! We will also be updating the website with more details as the wedding gets closer.",
    },
  ],
  navigation,
} as const;
