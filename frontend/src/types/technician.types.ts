/** Public technician shape from GET /api/technicians and GET /api/technicians/:id */
export interface PublicTechnician {
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

/** Public service from GET /api/technicians/:id/services */
export interface PublicService {
  _id: string;
  name: string;
  description?: string;
  duration?: number;
  price: number;
  category?: string;
}

/** Public gallery item from GET /api/technicians/:id/gallery */
export interface PublicGalleryItem {
  _id: string;
  image: { url: string; publicId: string };
  description?: string;
  tags?: string[];
}

/** Public review from GET /api/technicians/:id/reviews */
export interface PublicReview {
  _id: string;
  rating: number;
  feedback: string;
  image?: { url: string; publicId: string };
  createdAt: string;
  userId?: { name: string };
}
