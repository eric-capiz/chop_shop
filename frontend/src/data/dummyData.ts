// Dummy data for 2.0 multi-barber frontend development
// Credentials: admin1/admin1 through admin5/admin5

export interface Barber {
  id: string;
  username: string;
  password: string;
  name: string;
  role: "admin";
  profileImage: string;
  bio: string;
  specialties: string[];
  yearsOfExperience: number;
  socialMedia: {
    instagram: string;
    facebook: string;
    twitter: string;
  };
  payment: {
    note: string;
    cashApp: string;
    zelleEmail: string;
  };
  contactPhone: string;
}

export interface DummyService {
  _id: string;
  barberId: string;
  name: string;
  description: string;
  duration: number;
  price: number;
  category: string;
  isActive: boolean;
}

export interface DummyGalleryItem {
  _id: string;
  barberId: string;
  image: {
    url: string;
    publicId: string;
  };
  description: string;
  tags: string[];
  isActive: boolean;
}

export interface DummyTimeSlot {
  start: string;
  end: string;
  isBooked: boolean;
}

export interface DummyAvailability {
  barberId: string;
  schedule: {
    date: string;
    isWorkingDay: boolean;
    timeSlots: DummyTimeSlot[];
  }[];
}

export interface DummyReview {
  _id: string;
  barberId: string;
  userId: { _id: string; name: string };
  rating: number;
  feedback: string;
  image?: { url: string; publicId: string };
  createdAt: string;
}

// 5 Barbers with unique bios
export const barbers: Barber[] = [
  {
    id: "barber1",
    username: "admin1",
    password: "admin1",
    name: "Marcus Johnson",
    role: "admin",
    profileImage: "https://i.pravatar.cc/300?img=11",
    bio: "With over 15 years in the game, I've mastered the art of the perfect fade. Started cutting hair in my grandmother's kitchen and worked my way up through some of the best shops in the city. My philosophy is simple: every client leaves looking and feeling like a million bucks. I specialize in modern fades and classic cuts with a contemporary twist.",
    specialties: ["Skin Fades", "Beard Sculpting", "Hot Towel Shaves"],
    yearsOfExperience: 15,
    socialMedia: {
      instagram: "@marcus_cuts",
      facebook: "MarcusTheBarber",
      twitter: "@marcus_barber",
    },
    payment: {
      note: "Cash only. I also accept Cash App and Zelle.",
      cashApp: "$MarcusCuts",
      zelleEmail: "marcus.cuts.zelle@example.com",
    },
    contactPhone: "(555) 555-0101",
  },
  {
    id: "barber2",
    username: "admin2",
    password: "admin2",
    name: "Diego Ramirez",
    role: "admin",
    profileImage: "https://i.pravatar.cc/300?img=12",
    bio: "I bring the flavor of traditional Latin barbering mixed with modern techniques. Trained in Mexico City before moving stateside, I've developed a unique style that blends old-school precision with new-school creativity. Whether you want a clean taper or an intricate design, I've got you covered. My chair is where art meets grooming.",
    specialties: ["Hair Designs", "Tapers", "Line-ups"],
    yearsOfExperience: 10,
    socialMedia: {
      instagram: "@diego_styles",
      facebook: "DiegoBarberShop",
      twitter: "@diego_cuts",
    },
    payment: {
      note: "Cash only. I also accept Cash App and Zelle.",
      cashApp: "$DiegoStyles",
      zelleEmail: "diego.styles.zelle@example.com",
    },
    contactPhone: "(555) 555-0102",
  },
  {
    id: "barber3",
    username: "admin3",
    password: "admin3",
    name: "Jamal Williams",
    role: "admin",
    profileImage: "https://i.pravatar.cc/300?img=13",
    bio: "They call me the texture king for a reason. I specialize in working with all hair types, especially curly and coily textures. After completing advanced training in textured hair techniques, I've dedicated my career to helping clients embrace and enhance their natural hair. From afros to twists to the crispest lineups, I treat every head like a canvas.",
    specialties: ["Textured Cuts", "Afro Shaping", "Twist Outs"],
    yearsOfExperience: 8,
    socialMedia: {
      instagram: "@jamal_textures",
      facebook: "JamalCuts",
      twitter: "@jamal_barber",
    },
    payment: {
      note: "Cash only. I also accept Cash App and Zelle.",
      cashApp: "$JamalTextures",
      zelleEmail: "jamal.textures.zelle@example.com",
    },
    contactPhone: "(555) 555-0103",
  },
  {
    id: "barber4",
    username: "admin4",
    password: "admin4",
    name: "Tony Marchetti",
    role: "admin",
    profileImage: "https://i.pravatar.cc/300?img=14",
    bio: "Third generation barber right here. My grandfather opened his first shop in Brooklyn in 1952, and the craft has been in my blood ever since. I'm all about that classic gentleman's cut - the kind that never goes out of style. Hot towel shaves, pompadours, and slick backs are my bread and butter. Step into my chair for a taste of timeless tradition.",
    specialties: ["Classic Cuts", "Pompadours", "Straight Razor Shaves"],
    yearsOfExperience: 20,
    socialMedia: {
      instagram: "@tony_classic",
      facebook: "MarchettiBarbering",
      twitter: "@tony_barber",
    },
    payment: {
      note: "Cash only. I also accept Cash App and Zelle.",
      cashApp: "$TonyClassic",
      zelleEmail: "tony.classic.zelle@example.com",
    },
    contactPhone: "(555) 555-0104",
  },
  {
    id: "barber5",
    username: "admin5",
    password: "admin5",
    name: "Kevin Park",
    role: "admin",
    profileImage: "https://i.pravatar.cc/300?img=15",
    bio: "Coming from a background in fashion and design, I see haircuts as wearable art. I stay on top of the latest trends from Seoul to Paris and bring that international flair to every cut. Known for my precision work and attention to detail, I specialize in Asian hair textures and modern Korean-inspired styles. Let's create something fresh together.",
    specialties: ["Korean Styles", "Precision Cuts", "Color Consultation"],
    yearsOfExperience: 6,
    socialMedia: {
      instagram: "@kevin_precision",
      facebook: "KevinParkBarber",
      twitter: "@kevin_cuts",
    },
    payment: {
      note: "Cash only. I also accept Cash App and Zelle.",
      cashApp: "$KevinPrecision",
      zelleEmail: "kevin.precision.zelle@example.com",
    },
    contactPhone: "(555) 555-0105",
  },
];

// Services - same for all barbers (can be customized per barber later)
export const services: DummyService[] = [
  {
    _id: "service1",
    barberId: "all",
    name: "Classic Haircut",
    description: "Traditional haircut with clippers and scissors. Includes consultation, cut, and style.",
    duration: 30,
    price: 35,
    category: "haircut",
    isActive: true,
  },
  {
    _id: "service2",
    barberId: "all",
    name: "Skin Fade",
    description: "Clean fade down to the skin with seamless blending. Sharp and modern look.",
    duration: 45,
    price: 45,
    category: "haircut",
    isActive: true,
  },
  {
    _id: "service3",
    barberId: "all",
    name: "Beard Trim",
    description: "Shape and trim your beard to perfection. Includes line-up and conditioning.",
    duration: 20,
    price: 20,
    category: "facial-hair",
    isActive: true,
  },
  {
    _id: "service4",
    barberId: "all",
    name: "Haircut + Beard Combo",
    description: "Full haircut service combined with a beard trim and shape. Best value.",
    duration: 60,
    price: 55,
    category: "combo",
    isActive: true,
  },
  {
    _id: "service5",
    barberId: "all",
    name: "Hot Towel Shave",
    description: "Luxurious straight razor shave with hot towel treatment and aftercare.",
    duration: 45,
    price: 40,
    category: "facial-hair",
    isActive: true,
  },
  {
    _id: "service6",
    barberId: "all",
    name: "Kids Haircut",
    description: "Haircut for children 12 and under. Patient and friendly service.",
    duration: 25,
    price: 25,
    category: "haircut",
    isActive: true,
  },
];

// Gallery items - shared placeholder images
export const galleryItems: DummyGalleryItem[] = [
  {
    _id: "gallery1",
    barberId: "all",
    image: {
      url: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=400",
      publicId: "gallery1",
    },
    description: "Clean skin fade",
    tags: ["fade", "modern"],
    isActive: true,
  },
  {
    _id: "gallery2",
    barberId: "all",
    image: {
      url: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=400",
      publicId: "gallery2",
    },
    description: "Classic gentleman's cut",
    tags: ["classic", "professional"],
    isActive: true,
  },
  {
    _id: "gallery3",
    barberId: "all",
    image: {
      url: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400",
      publicId: "gallery3",
    },
    description: "Textured crop",
    tags: ["textured", "modern"],
    isActive: true,
  },
  {
    _id: "gallery4",
    barberId: "all",
    image: {
      url: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=400",
      publicId: "gallery4",
    },
    description: "Beard grooming",
    tags: ["beard", "grooming"],
    isActive: true,
  },
  {
    _id: "gallery5",
    barberId: "all",
    image: {
      url: "https://images.unsplash.com/photo-1587909209111-5097ee578ec3?w=400",
      publicId: "gallery5",
    },
    description: "Fresh lineup",
    tags: ["lineup", "clean"],
    isActive: true,
  },
  {
    _id: "gallery6",
    barberId: "all",
    image: {
      url: "https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=400",
      publicId: "gallery6",
    },
    description: "Modern pompadour",
    tags: ["pompadour", "styled"],
    isActive: true,
  },
];

// Dummy reviews per barber (max 3 shown per barber on Our Work page)
const reviewTemplates: { feedback: string; rating: number; name: string }[] = [
  { feedback: "Best fade I've ever had. Clean, precise, and fast. Will definitely be back!", rating: 5, name: "Mike T." },
  { feedback: "Professional service and great conversation. My go-to barber now.", rating: 5, name: "James L." },
  { feedback: "Solid cut every time. Fair price and always on schedule.", rating: 4, name: "David R." },
  { feedback: "Really knows how to work with my hair type. Highly recommend.", rating: 5, name: "Chris K." },
  { feedback: "Great attention to detail. The lineup was crisp.", rating: 5, name: "Alex M." },
  { feedback: "Friendly and skilled. Best barbershop experience I've had.", rating: 5, name: "Jordan P." },
  { feedback: "Consistent quality. Been coming here for months.", rating: 4, name: "Sam W." },
  { feedback: "Fixed a bad cut I got elsewhere. Total pro.", rating: 5, name: "Tony G." },
  { feedback: "Quick, clean, and affordable. Can't ask for more.", rating: 5, name: "Ryan S." },
  { feedback: "Amazing with beard work too. One-stop shop.", rating: 5, name: "Marcus J." },
  { feedback: "Always leaves me looking fresh. 10/10.", rating: 5, name: "Devin H." },
  { feedback: "Worth the wait. Best barber in town.", rating: 5, name: "Kevin B." },
  { feedback: "Great vibe, even better cuts. Book him!", rating: 5, name: "Brandon F." },
  { feedback: "Precision work. You can tell he cares.", rating: 5, name: "Andre C." },
  { feedback: "Super talented. My whole crew comes here now.", rating: 5, name: "Nathan D." },
];

export const reviews: DummyReview[] = barbers.flatMap((barber, bi) =>
  reviewTemplates.slice(bi * 3, bi * 3 + 3).map((t, i) => ({
    _id: `review-${barber.id}-${i}`,
    barberId: barber.id,
    userId: { _id: `user-${barber.id}-${i}`, name: t.name },
    rating: t.rating,
    feedback: t.feedback,
    createdAt: new Date(Date.now() - (i + 1) * 86400000 * 7).toISOString(),
  }))
);

// Generate dummy availability for the next 30 days
const generateTimeSlots = (): DummyTimeSlot[] => {
  const slots: DummyTimeSlot[] = [];
  const startHour = 9; // 9 AM
  const endHour = 18; // 6 PM

  for (let hour = startHour; hour < endHour; hour++) {
    slots.push({
      start: `${hour.toString().padStart(2, "0")}:00`,
      end: `${hour.toString().padStart(2, "0")}:30`,
      isBooked: Math.random() > 0.7, // 30% chance of being booked
    });
    slots.push({
      start: `${hour.toString().padStart(2, "0")}:30`,
      end: `${(hour + 1).toString().padStart(2, "0")}:00`,
      isBooked: Math.random() > 0.7,
    });
  }
  return slots;
};

const generateSchedule = () => {
  const schedule = [];
  const today = new Date();

  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const dayOfWeek = date.getDay();
    // Closed on Sundays (0), working Mon-Sat
    const isWorkingDay = dayOfWeek !== 0;

    schedule.push({
      date: date.toISOString().split("T")[0],
      isWorkingDay,
      timeSlots: isWorkingDay ? generateTimeSlots() : [],
    });
  }
  return schedule;
};

// Availability for each barber
export const availability: DummyAvailability[] = barbers.map((barber) => ({
  barberId: barber.id,
  schedule: generateSchedule(),
}));

// Dummy regular user (same as 1.0 – login required to book)
export const dummyUser = {
  id: "user-breezy",
  username: "breezy",
  password: "breezy",
  name: "Breezy",
  email: "breezy@example.com",
  role: "user" as const,
};

export const validateUserLogin = (
  username: string,
  password: string
): typeof dummyUser | null => {
  if (
    username === dummyUser.username &&
    password === dummyUser.password
  ) {
    return dummyUser;
  }
  return null;
};

// Helper functions
export const getBarberById = (id: string): Barber | undefined => {
  return barbers.find((b) => b.id === id);
};

export const getBarberByUsername = (username: string): Barber | undefined => {
  return barbers.find((b) => b.username === username);
};

export const validateBarberLogin = (
  username: string,
  password: string
): Barber | null => {
  const barber = barbers.find(
    (b) => b.username === username && b.password === password
  );
  return barber || null;
};

export const getServicesForBarber = (barberId: string): DummyService[] => {
  return services.filter((s) => s.barberId === "all" || s.barberId === barberId);
};

export const getGalleryForBarber = (barberId: string): DummyGalleryItem[] => {
  return galleryItems.filter(
    (g) => g.barberId === "all" || g.barberId === barberId
  );
};

export const getTopGalleryForBarber = (
  barberId: string,
  max = 3
): DummyGalleryItem[] => {
  return getGalleryForBarber(barberId).slice(0, max);
};

export const getReviewsForBarber = (
  barberId: string,
  max = 3
): DummyReview[] => {
  return reviews.filter((r) => r.barberId === barberId).slice(0, max);
};

export const getAvailabilityForBarber = (
  barberId: string
): DummyAvailability | undefined => {
  return availability.find((a) => a.barberId === barberId);
};
