export interface NailArtist {
  id: string;
  name: string;
  title: string;
  specialties: string[];
  yearsOfExperience: number;
  bio: string;
  image: string;
}

export const artists: NailArtist[] = [
  {
    id: "sofia",
    name: "Sofia Reyes",
    title: "Master Nail Artist",
    specialties: ["Gel-X", "Hand-Painted Art", "Sculpted Acrylics"],
    yearsOfExperience: 8,
    bio: "Sofia has spent eight years perfecting the art of the perfect nail. Known for her intricate hand-painted designs and flawless Gel-X application, she believes every set should feel like jewelry for your hands.",
    image: "https://images.unsplash.com/photo-1600948836101-f9ffda59d250?w=800&q=80",
  },
  {
    id: "maya",
    name: "Maya Chen",
    title: "Senior Nail Artist",
    specialties: ["Japanese Gel", "Minimalist Designs", "Nail Health"],
    yearsOfExperience: 6,
    bio: "Maya specializes in the delicate art of Japanese gel and minimalist design. Her philosophy: healthy nails first, beautiful nails always. Clients love her calming presence and precision.",
    image: "https://images.unsplash.com/photo-1610992015732-2449b76344bc?w=800&q=80",
  },
  {
    id: "jasmine",
    name: "Jasmine Cole",
    title: "Nail Artist & Pedicure Specialist",
    specialties: ["Spa Pedicures", "Chrome & Cat-Eye", "Acrylics"],
    yearsOfExperience: 5,
    bio: "Jasmine turns every pedicure into a retreat. Her spa pedicures are legendary, and her chrome and cat-eye finishes are pure magic. Come for the nails, stay for the relaxation.",
    image: "https://images.unsplash.com/photo-1607779097040-26e80aa78e66?w=800&q=80",
  },
];
