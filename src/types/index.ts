export interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
  role: 'client' | 'team' | 'admin';
  avatar?: string;
}

export interface Team {
  id: string;
  name: string;
  logo: string;
  rating: number;
  reviewCount: number;
  basePrice: number;
  location: string;
  equipment: string[];
  certifications: string[];
  insurance: boolean;
  description: string;
  portfolioCount: number;
  tags: string[];
}

export interface Requirement {
  id: string;
  userId: string;
  location: string;
  date: string;
  startTime: string;
  endTime: string;
  budget: number;
  category: 'wedding' | 'realestate' | 'event' | 'other';
  description: string;
  referenceImages: string[];
  status: 'draft' | 'published' | 'matched' | 'confirmed';
  createdAt: string;
}

export interface Quote {
  id: string;
  teamId: string;
  requirementId: string;
  packageType: 'basic' | 'standard' | 'premium';
  flightHours: number;
  cameras: number;
  postProduction: boolean;
  deliveryDays: number;
  totalPrice: number;
  status: 'pending' | 'accepted' | 'rejected';
  includes: string[];
}

export interface Order {
  id: string;
  requirementId: string;
  teamId: string;
  quoteId: string;
  teamName: string;
  contractSigned: boolean;
  depositPaid: boolean;
  depositAmount: number;
  balanceAmount: number;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'shooting' | 'delivered' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface Schedule {
  id: string;
  orderId: string;
  shootDate: string;
  shootTime: string;
  shootList: { item: string; confirmed: boolean }[];
  contactName: string;
  contactPhone: string;
  emergencyContact: string;
  rescheduleRequest?: {
    reason: string;
    newDate: string;
    status: 'pending' | 'approved' | 'rejected';
  };
}

export interface DeliveryMaterial {
  id: string;
  name: string;
  type: 'image' | 'video';
  thumbnail: string;
  watermarkedUrl: string;
  originalUrl?: string;
}

export interface Delivery {
  id: string;
  orderId: string;
  materials: DeliveryMaterial[];
  balancePaid: boolean;
  copyrightLicense: 'personal' | 'commercial' | 'exclusive';
  deliveredAt: string;
}

export interface Review {
  id: string;
  orderId: string;
  userId: string;
  teamId: string;
  teamName: string;
  professionalism: number;
  timeliness: number;
  communication: number;
  overallRating: number;
  comment: string;
  images?: string[];
  complaint?: {
    reason: string;
    evidence: string[];
    status: 'pending' | 'processing' | 'resolved';
  };
  createdAt: string;
}

export interface PortfolioItem {
  id: string;
  teamId: string;
  teamName: string;
  title: string;
  category: 'wedding' | 'realestate' | 'event' | 'cityscape';
  thumbnail: string;
  images: string[];
  description: string;
  tags: string[];
  createdAt: string;
}
