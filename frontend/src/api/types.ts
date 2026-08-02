export interface Course {
  _id: string;
  title: string;
  description: string;
  duration?: string;
  price?: string;
  image?: string;
  order?: number;
  isActive?: boolean;
}

export interface Blog {
  _id: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  publishedAt?: string;
  isActive?: boolean;
}

export interface Teacher {
  _id: string;
  name: string;
  position: string;
  bio: string;
  photo?: string;
  order?: number;
  isActive?: boolean;
}

export type ReviewStatus = 'pending' | 'approved' | 'rejected';

export interface Review {
  _id: string;
  authorName: string;
  text: string;
  rating: number;
  branch?: string;
  status: ReviewStatus;
  createdAt?: string;
}

export interface ContactRequest {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  message?: string;
  branch?: string;
  isRead?: boolean;
  createdAt?: string;
}

export interface About {
  _id?: string;
  title: string;
  text: string;
  image?: string;
  studentsCount: number;
  teachersCount: number;
  coursesCount: number;
  yearsOnMarket: number;
}

export interface SiteSettings {
  _id?: string;
  siteName: string;
  phone: string;
  email: string;
  instagram?: string;
  facebook?: string;
  whatsapp?: string;
  workingHours?: string;
}
