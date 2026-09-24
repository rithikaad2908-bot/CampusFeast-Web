export type CategoryId =
  | 'pizza'
  | 'burgers'
  | 'rolls'
  | 'south-indian'
  | 'rice-noodles'
  | 'snacks'
  | 'beverages';

export interface Category {
  id: CategoryId;
  name: string;
  icon: string;
  description: string;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
  isUserSubmitted?: boolean;
}

export interface UserReview {
  id: string;
  orderId: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
}

export interface FoodItem {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  ingredients: string[];
  price: number;
  image: string;
  category: CategoryId;
  isVeg: boolean;
  rating: number;
  ratingCount: number;
  prepTime: number; // minutes
  location: string;
  popular?: boolean;
  recommended?: boolean;
  reviews: Review[];
}

export interface CartItem {
  food: FoodItem;
  quantity: number;
}

export interface CampusLocation {
  id: string;
  name: string;
  blocks: string[];
}

export interface Deal {
  id: string;
  title: string;
  description: string;
  tag: string;
  items: string;
  price: number;
  originalPrice: number;
  image: string;
}

export type OrderStatus = 'placed' | 'preparing' | 'ready' | 'completed';

export type FulfillmentType = 'pickup' | 'delivery';
export type PaymentMethod = 'cash' | 'upi' | 'card';

export interface Order {
  id: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  total: number;
  studentName: string;
  studentEmail: string;
  phone: string;
  campus: string;
  block: string;
  fulfillment: FulfillmentType;
  paymentMethod: PaymentMethod;
  instructions: string;
  placedAt: string;
  estimatedTime: number; // minutes
  status: OrderStatus;
  rated?: boolean;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  campus: string;
  block: string;
  savedLocations: string[];
}

export type PageId =
  | 'home'
  | 'menu'
  | 'food-detail'
  | 'cart'
  | 'checkout'
  | 'confirmation'
  | 'tracking'
  | 'orders'
  | 'favorites'
  | 'profile';

export interface FoodRatingInfo {
  rating: number;
  ratingCount: number;
}
