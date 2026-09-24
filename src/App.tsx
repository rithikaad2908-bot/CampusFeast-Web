import { AppProvider, useApp } from '@/context';
import { BottomNav, DesktopNav } from '@/components/Navigation';
import { Logo } from '@/components/Logo';
import { CampusSelector } from '@/components/CampusSelector';
import { ToastHost } from '@/components/Toast';
import { HomePage } from '@/pages/HomePage';
import { MenuPage } from '@/pages/MenuPage';
import { FoodDetailPage } from '@/pages/FoodDetailPage';
import { CartPage } from '@/pages/CartPage';
import { CheckoutPage } from '@/pages/CheckoutPage';
import { ConfirmationPage } from '@/pages/ConfirmationPage';
import { TrackingPage } from '@/pages/TrackingPage';
import { OrdersPage } from '@/pages/OrdersPage';
import { FavoritesPage } from '@/pages/FavoritesPage';
import { ProfilePage } from '@/pages/ProfilePage';

function MobileHeader() {
  const { page, navigate } = useApp();
  const showHeader = page !== 'home' && page !== 'food-detail';

  if (!showHeader) return null;

  return (
    <header className="md:hidden sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-ink-200">
      <div className="flex items-center justify-between px-4 h-14">
        <Logo size="sm" onClick={() => navigate('home')} />
        <CampusSelector compact />
      </div>
    </header>
  );
}

function PageRouter() {
  const { page } = useApp();

  switch (page) {
    case 'home':
      return <HomePage />;
    case 'menu':
      return <MenuPage />;
    case 'food-detail':
      return <FoodDetailPage />;
    case 'cart':
      return <CartPage />;
    case 'checkout':
      return <CheckoutPage />;
    case 'confirmation':
      return <ConfirmationPage />;
    case 'tracking':
      return <TrackingPage />;
    case 'orders':
      return <OrdersPage />;
    case 'favorites':
      return <FavoritesPage />;
    case 'profile':
      return <ProfilePage />;
    default:
      return <HomePage />;
  }
}

function AppContent() {
  const { page } = useApp();

  return (
    <div className="min-h-screen bg-ink-50">
      <DesktopNav />
      <MobileHeader />
      <main className={`pb-20 md:pb-8 ${page === 'food-detail' ? 'pb-32 md:pb-32' : ''}`}>
        <PageRouter />
      </main>
      <BottomNav />
      <ToastHost />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
