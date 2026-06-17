export const EVENT = {
  name: "Kwara Kre8ives 2.0",
  tagline: "Empowering 2,000 Creatives for the Future",
  dateISO: "2026-06-30T09:00:00+01:00",
  dateLabel: "30th June, 2026",
  arrivalTime: "9:00 AM",
  venue: {
    name: "Ilorin Innovation Hub",
    address: "9a Ahmadu Bello Way, GRA, Ilorin, Nigeria",
    mapsEmbed:
      "https://www.google.com/maps?q=Ilorin+Innovation+Hub,+9a+Ahmadu+Bello+Way,+GRA,+Ilorin,+Nigeria&output=embed",
    directionsUrl:
      "https://www.google.com/maps/dir/?api=1&destination=Ilorin+Innovation+Hub,+9a+Ahmadu+Bello+Way,+GRA,+Ilorin,+Nigeria",
  },
  contact: {
    phone: "0705 846 3821",
    instagram: "Kwara_Kre8ives",
    facebook: "Kwara Kre8ives",
  },
  partners: [
    "Federal Ministry of Art, Culture, Tourism & Creative Economy",
    "Kwara State Government",
    "Ilorin Innovation Hub",
  ],
} as const;

export const CLASSES = [
  { name: "Photography", icon: "Camera", desc: "Master composition, lighting, and visual storytelling." },
  { name: "Videography", icon: "Video", desc: "Shoot and edit cinematic video for brands and creators." },
  { name: "Content Creation", icon: "Sparkles", desc: "Build a creator brand audiences come back for." },
  { name: "Branding & Digital Marketing", icon: "Megaphone", desc: "Position brands and grow them with paid + organic." },
  { name: "Social Media Management", icon: "Hash", desc: "Strategy, calendars, analytics, and growth playbooks." },
] as const;

export const CLASS_NAMES = CLASSES.map((c) => c.name);
export type ClassName = (typeof CLASSES)[number]["name"];

export const AGE_RANGES = ["13–17", "18–24", "25–34", "35+"] as const;

export const BATCH_CAPACITY = 50;
