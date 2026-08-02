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
  },
  navigation: [
    { href: "/", label: "Home" },
    { href: "/schedule", label: "Schedule" },
    { href: "/travel", label: "Travel" },
    { href: "/faq", label: "FAQ" },
  ],
} as const;
