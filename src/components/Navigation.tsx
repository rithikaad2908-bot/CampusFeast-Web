import {
  Home,
  Utensils,
  Receipt,
  Heart,
  User,
  ShoppingBag,
} from 'lucide-react';
import { useApp } from '@/context';
import type { PageId } from '@/types';

const navItems: { page: PageId; label: string; icon: typeof Home }[] = [
  { page: 'home', label: 'Home', icon: Home },
  { page: 'menu', label: 'Menu', icon: Utensils },
  { page: 'orders', label: 'Orders', icon: Receipt },
  { page: 'favorites', label: 'Favorites', icon: Heart },
  { page: 'profile', label: 'Profile', icon: User },
];

export function BottomNav() {
  const { page, navigate, cartCount } = useApp();

  return (
    <>
      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white border-t border-ink-200 pb-safe">
        <div className="flex items-center justify-around px-2 py-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = page === item.page;
            return (
              <button
                key={item.page}
                onClick={() => navigate(item.page)}
                className="relative flex flex-col items-center gap-0.5 py-1.5 px-3 rounded-xl transition-colors"
                aria-label={item.label}
                aria-current={isActive ? 'page' : undefined}
              >
                <div className="relative">
                  <Icon
                    className={`w-5.5 h-5.5 transition-all ${
                      isActive ? 'text-brand-500' : 'text-ink-400'
                    }`}
                    strokeWidth={isActive ? 2.5 : 2}
                    style={{ width: 22, height: 22 }}
                  />
                  {item.page === 'favorites' && (
                    <span className="absolute -top-1.5 -right-1.5 w-2 h-2 rounded-full bg-brand-400" />
                  )}
                </div>
                <span
                  className={`text-[10px] font-semibold transition-colors ${
                    isActive ? 'text-brand-600' : 'text-ink-400'
                  }`}
                >
                  {item.label}
                </span>
                {isActive && (
                  <span className="absolute -top-px left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-brand-400" />
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Floating cart button (mobile) */}
      {cartCount > 0 && (
        <button
          onClick={() => navigate('cart')}
          className="fixed bottom-20 right-4 z-50 md:hidden flex items-center gap-2 bg-ink-900 text-white rounded-full shadow-lg pl-4 pr-5 py-3 active:scale-95 transition-transform animate-scale-in"
          aria-label={`Cart with ${cartCount} items`}
        >
          <ShoppingBag className="w-5 h-5 text-brand-400" />
          <span className="text-sm font-bold">{cartCount}</span>
          <span className="text-xs font-medium text-ink-300">View Cart</span>
        </button>
      )}
    </>
  );
}

export function DesktopNav() {
  const { page, navigate, cartCount } = useApp();

  const allItems = [...navItems, { page: 'cart' as PageId, label: 'Cart', icon: ShoppingBag }];

  return (
    <header className="hidden md:flex sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-ink-200">
      <div className="max-w-6xl mx-auto w-full flex items-center justify-between px-6 h-16">
        <div className="flex items-center gap-8">
          {allItems.map((item) => {
            const Icon = item.icon;
            const isActive = page === item.page;
            return (
              <button
                key={item.page}
                onClick={() => navigate(item.page)}
                className={`flex items-center gap-2 text-sm font-semibold transition-colors relative ${
                  isActive ? 'text-ink-900' : 'text-ink-500 hover:text-ink-800'
                }`}
              >
                <Icon className="w-4 h-4" strokeWidth={isActive ? 2.5 : 2} />
                {item.label}
                {item.page === 'cart' && cartCount > 0 && (
                  <span className="absolute -top-2 -right-3 w-5 h-5 rounded-full bg-brand-400 text-ink-900 text-[10px] font-bold flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
                {isActive && (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full bg-brand-400" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
