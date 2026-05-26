export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  discountPrice?: number | null;
  imageUrls: string[];
  stock: number;
  isActive: boolean;
  brand?: string | null;
  sku?: string | null;
  weight?: string | null;
  dimensions?: string | null;
  ingredients?: string | null;
  howToUse?: string | null;
  warnings?: string | null;
  averageRating: number;
  reviewCount: number;
  categoryId: string;
  category?: Category;
  reviews?: Review[];
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  icon?: string | null;
  imageUrl?: string | null;
  _count?: { products: number };
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  slug?: string;
}

export interface Review {
  id: string;
  rating: number;
  title?: string | null;
  content: string;
  userId: string;
  user?: { name: string | null; avatarUrl: string | null };
  productId: string;
  createdAt: Date | string;
}

export interface Testimonial {
  id: string;
  name: string;
  content: string;
  rating: number;
  imageUrl?: string | null;
  isActive: boolean;
  order: number;
  createdAt: Date | string;
}

export interface Video {
  id: string;
  title: string;
  url: string;
  description?: string | null;
  thumbnailUrl?: string | null;
  order: number;
  isActive: boolean;
  createdAt: Date | string;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  totalPrice?: number;
  date: string;
  status:
    | "pending"
    | "paid"
    | "sent"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled";
  paymentMethod?: string;
  paymentId?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
}

export interface AdminUser {
  id: string;
  email: string;
  name?: string | null;
  role: "ADMIN" | "SUPERADMIN";
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  message: string;
  responded: boolean;
  submittedAt: Date | string;
}

export interface NewsletterSubscription {
  id: string;
  email: string;
  isActive: boolean;
  createdAt: Date | string;
}

export interface SiteContent {
  id: string;
  key: string;
  value: any;
  updatedAt: Date | string;
}
