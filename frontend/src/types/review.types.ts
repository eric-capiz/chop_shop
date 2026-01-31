export interface Review {
  _id: string;
  userId: {
    _id: string;
    name: string;
  };
  /** Barber (admin) - when populated from API */
  adminId?:
    | string
    | {
        _id: string;
        name: string;
      };
  /** When populated from API, includes serviceId */
  appointmentId:
    | string
    | {
        serviceId?: { name: string };
      };
  rating: number;
  feedback: string;
  image?: {
    url: string;
    publicId: string;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
