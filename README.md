# CampusFeast

**Good Food. Campus Vibes.**

CampusFeast is a modern, mobile-first food-ordering web application built specifically for college students to order food from campus canteens and food stalls. It provides a complete end-to-end ordering experience — from browsing the menu to tracking your order — all within a clean, youthful, and intuitive interface.

> This is a student-built demonstration project. All data is sample/demo data, no real payments are processed, and no real authentication is required.

---

## Features

### Core Ordering Flow
- **Home Page** with hero section, search bar, featured categories, and attractive food imagery
- **Campus Selector** to choose your campus canteen and block/location
- **Menu Page** with food cards showing image, name, description, price, veg indicator, rating, and preparation time
- **Search & Filter** — working search, category filtering, veg-only filter, and price/rating sorting
- **Food Details** page with large image, full description, ingredients, rating, prep time, quantity selector, and reviews
- **Cart** with quantity controls, item removal, subtotal, student discount, and total
- **Checkout** with student details form, campus/block selection, delivery/pickup option, special instructions, and payment method selection (UPI / Cash / Card)
- **Order Confirmation** screen with unique order ID, estimated time, order summary, and pickup/delivery location
- **Order Tracking** with a visual status timeline: Placed → Preparing → Ready → Completed

### Student Features
- **Favourites** — save and view your favourite food items
- **Recently Ordered** — quick access to items from previous orders
- **Popular on Campus** — trending items
- **Campus Deals** — combo offers, student discounts, and limited-time offers
- **Recommended For You** — personalised recommendations
- **Quick Reorder** — instantly re-order your last meal

### Pizza Category
- Margherita, Paneer Tikka, Corn & Cheese, Chicken Cheese, and Spicy Veg pizzas
- Each with image, description, price, prep time, rating, and Add to Cart

### Post-Order Rating System
- After an order is completed, a "Rate Your Order" section appears on the tracking page and orders page
- Star selection (1–5) with optional written review
- Submitted ratings are saved to local storage and update the food item's displayed average rating and review count
- User-submitted reviews appear on food detail pages with a "Your Review" badge, clearly distinguished from sample reviews

### Reviews
- Sample ratings and reviews displayed on each food item's detail page (clearly marked as sample reviews)
- User-submitted reviews appear above sample reviews with a distinct "Your Review" badge
- Average rating and rating count update dynamically when new demo ratings are submitted

### Profile
- Student profile with editable name, email, and phone
- Saved locations management
- Order history and favourites shortcuts
- Logout (demo — no real auth)

### Navigation
- **Mobile**: Bottom navigation bar (Home, Menu, Orders, Favourites, Profile) with a floating cart button
- **Desktop**: Top navigation bar with all links including Cart

### Design
- Premium, modern UI with rounded cards, subtle shadows, and smooth animations
- Warm yellow/golden accent on a clean black/white palette
- Fully responsive — mobile-first, works beautifully on tablets, laptops, and desktops
- Micro-interactions: hover effects, active states, fade-in animations, toast notifications
- Professional empty states and loading-friendly image rendering

---

## Technologies Used

- **React 18** with TypeScript
- **Vite** as the build tool
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Plus Jakarta Sans** Google Font for typography
- **localStorage** for client-side persistence (cart, favourites, orders, profile)
- **Pexels** for food photography

---

## How to Run

### Prerequisites
- Node.js 18+ and npm

### Installation
```bash
# Install dependencies
npm install

# Start the development server
npm run dev

# Build for production
npm run build

# Preview the production build
npm run preview

# Run type checking
npm run typecheck
```

The dev server runs at `http://localhost:5173` by default.

---

## Project Structure

```
src/
├── App.tsx                 # Root component with routing
├── main.tsx                # App entry point
├── index.css               # Global styles & animations
├── types.ts                # TypeScript type definitions
├── data.ts                 # Sample data (food items, categories, deals, campuses)
├── context.tsx             # App state context (cart, favorites, orders, navigation)
├── components/             # Reusable UI components
│   ├── Logo.tsx
│   ├── Navigation.tsx
│   ├── FoodCard.tsx
│   ├── Category.tsx
│   ├── CampusSelector.tsx
│   ├── Modal.tsx
│   ├── Toast.tsx
│   ├── EmptyState.tsx
│   ├── StarRating.tsx        # Star rating input + RateOrder component
│   ├── VegBadge.tsx
│   └── RatingBadge.tsx
└── pages/                  # Page-level components
    ├── HomePage.tsx
    ├── MenuPage.tsx
    ├── FoodDetailPage.tsx
    ├── CartPage.tsx
    ├── CheckoutPage.tsx
    ├── ConfirmationPage.tsx
    ├── TrackingPage.tsx
    ├── OrdersPage.tsx
    ├── FavoritesPage.tsx
    └── ProfilePage.tsx
```

---

## Future Improvements

- **Real authentication** via Supabase (email/password or OAuth)
- **Database-backed menu and orders** using Supabase Postgres
- **Real-time order tracking** with live status updates from the kitchen
- **Push notifications** when an order is ready
- **Multi-campus support** with different menus per campus
- **Payment integration** (UPI, Razorpay, Stripe)
- **Loyalty program** with reward points for frequent orders
- **Nutritional information** for each food item
- **Dark mode** support
- **PWA support** for offline ordering

---

## Branding

- **Name**: CampusFeast
- **Tagline**: "Good Food. Campus Vibes."
- **Logo**: "Campus" in black, "Feast" in warm yellow, with an original utensils-crossed icon
- **Colors**: Black/dark charcoal primary text, warm yellow/golden accent, white/light backgrounds

All branding is original and not derived from any existing food delivery brand.

---

## License

This is a student demonstration project. Feel free to use it for educational purposes.

Built with care for the campus community.
