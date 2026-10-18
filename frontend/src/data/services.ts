export interface NailService {
  id: string;
  name: string;
  category: "manicure" | "pedicure" | "extensions" | "nail-art" | "combo";
  description: string;
  price: number;
  durationMin: number;
  image: string;
}

export const services: NailService[] = [
  {
    id: "classic-manicure",
    name: "Classic Manicure",
    category: "manicure",
    description:
      "Shape, cuticle care, gentle buff, and your choice of premium polish. The timeless treatment, done right.",
    price: 35,
    durationMin: 45,
    image: "https://images.unsplash.com/photo-1610992015732-2449b76344bc?w=800&q=80",
  },
  {
    id: "gel-manicure",
    name: "Gel Manicure",
    category: "manicure",
    description:
      "Chip-free shine for weeks. Includes classic manicure prep plus gel polish cured under LED light.",
    price: 55,
    durationMin: 60,
    image: "https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=800&q=80",
  },
  {
    id: "luxury-manicure",
    name: "Luxury Spa Manicure",
    category: "manicure",
    description:
      "Warm towel wrap, exfoliating scrub, hydrating mask, and extended massage. Pure indulgence for your hands.",
    price: 70,
    durationMin: 75,
    image: "https://images.unsplash.com/photo-1600948836101-f9ffda59d250?w=800&q=80",
  },
  {
    id: "classic-pedicure",
    name: "Classic Pedicure",
    category: "pedicure",
    description:
      "Soak, exfoliate, callus smoothing, cuticle care, massage, and polish. Your feet will thank you.",
    price: 45,
    durationMin: 60,
    image: "https://images.unsplash.com/photo-1607779097040-26e80aa78e66?w=800&q=80",
  },
  {
    id: "gel-pedicure",
    name: "Gel Pedicure",
    category: "pedicure",
    description:
      "Everything in the classic pedicure, finished with long-wear gel polish that stays flawless for weeks.",
    price: 65,
    durationMin: 75,
    image: "https://images.unsplash.com/photo-1607779097040-26e80aa78e66?w=800&q=80",
  },
  {
    id: "gelx-extensions",
    name: "Gel-X Extensions",
    category: "extensions",
    description:
      "Lightweight, natural-looking extensions with a perfect shape. No harsh odors, no damage — just length.",
    price: 85,
    durationMin: 90,
    image: "https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=800&q=80",
  },
  {
    id: "acrylic-fullset",
    name: "Acrylic Full Set",
    category: "extensions",
    description:
      "Bold length and dramatic shapes. Sculpted acrylics built to your exact vision, from almond to stiletto.",
    price: 95,
    durationMin: 105,
    image: "https://images.unsplash.com/photo-1614806687007-2215a9db3b1c?w=800&q=80",
  },
  {
    id: "handpainted-art",
    name: "Hand-Painted Nail Art",
    category: "nail-art",
    description:
      "Tiny canvases, big statements. Custom hand-painted designs — florals, French twists, chrome, and more.",
    price: 25,
    durationMin: 30,
    image: "https://images.unsplash.com/photo-1614806687007-2215a9db3b1c?w=800&q=80",
  },
  {
    id: "mani-pedi-combo",
    name: "Mani + Pedi Retreat",
    category: "combo",
    description:
      "The full experience: luxury manicure paired with a classic pedicure. Leave feeling brand new.",
    price: 105,
    durationMin: 120,
    image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800&q=80",
  },
];

export const serviceCategories = [
  { id: "manicure", label: "Manicures" },
  { id: "pedicure", label: "Pedicures" },
  { id: "extensions", label: "Extensions" },
  { id: "nail-art", label: "Nail Art" },
  { id: "combo", label: "Combos" },
] as const;
