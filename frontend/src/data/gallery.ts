export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  tag: string;
}

export const galleryImages: GalleryImage[] = [
  {
    id: "g1",
    src: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800&q=80",
    alt: "Elegant manicure in a luxury nail studio",
    tag: "Studio",
  },
  {
    id: "g2",
    src: "https://images.unsplash.com/photo-1610992015732-2449b76344bc?w=800&q=80",
    alt: "Classic manicure with premium polish",
    tag: "Manicure",
  },
  {
    id: "g3",
    src: "https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=800&q=80",
    alt: "Detailed nail work close-up",
    tag: "Detail",
  },
  {
    id: "g4",
    src: "https://images.unsplash.com/photo-1607779097040-26e80aa78e66?w=800&q=80",
    alt: "Relaxing spa pedicure treatment",
    tag: "Pedicure",
  },
  {
    id: "g5",
    src: "https://images.unsplash.com/photo-1614806687007-2215a9db3b1c?w=800&q=80",
    alt: "Custom hand-painted nail art",
    tag: "Nail Art",
  },
  {
    id: "g6",
    src: "https://images.unsplash.com/photo-1600948836101-f9ffda59d250?w=800&q=80",
    alt: "Inside the Luxe Nails studio",
    tag: "Studio",
  },
];
