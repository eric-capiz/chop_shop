/** Public barber shape from GET /api/barbers and GET /api/barbers/:id */
export interface PublicBarber {
  _id: string;
  name: string;
  email?: string;
  username: string;
  bio?: string;
  specialties?: string[];
  yearsOfExperience?: number;
  profileImage: {
    url: string;
    publicId: string;
  };
  socialMedia: {
    instagram: string;
    facebook: string;
    twitter: string;
  };
}

/** Public service from GET /api/barbers/:id/services */
export interface PublicService {
  _id: string;
  name: string;
  description?: string;
  duration?: number;
  price: number;
  category?: string;
}

/** Public gallery item from GET /api/barbers/:id/gallery */
export interface PublicGalleryItem {
  _id: string;
  image: { url: string; publicId: string };
  description?: string;
  tags?: string[];
}

/** Public review from GET /api/barbers/:id/reviews */
export interface PublicReview {
  _id: string;
  rating: number;
  feedback: string;
  image?: { url: string; publicId: string };
  createdAt: string;
  userId?: { name: string };
}
