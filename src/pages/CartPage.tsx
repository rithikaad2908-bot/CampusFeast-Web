import { Plus, Minus, Trash2, ArrowRight, ShoppingBag, Tag } from 'lucide-react';
import { useApp } from '@/context';
import { EmptyState } from '@/components/EmptyState';

export function CartPage() {
  const {
    cart,
    updateQuantity,
    removeFromCart,
    subtotal,
    discount,
    total,
    navigate,
    clearCart,
  } = useApp();

  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-5 pt-6">
        <h1 className="text-2xl font-extrabold text-ink-900 mb-4">Your Cart</h1>
        <EmptyState
          icon={ShoppingBag}
          title="Your cart is empty"
          description="Browse the menu and add some delicious campus food to your cart."
          actionLabel="Browse Menu"
          onAction={() => navigate('menu')}
        />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-5 pt-6 pb-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-extrabold text-ink-900">Your Cart</h1>
        <button
          onClick={clearCart}
          className="text-sm font-semibold text-ink-400 hover:text-red-500 transition-colors"
        >
          Clear all
        </button>
      </div>

      {/* Cart items */}
      <div className="space-y-3 mb-5">
        {cart.map((item) => (
          <div
            key={item.food.id}
            className="flex gap-3 bg-white rounded-2xl p-3 shadow-card animate-fade-in-up"
          >
            <img
              src={item.food.image}
              alt={item.food.name}
              className="w-20 h-20 rounded-xl object-cover shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-bold text-sm text-ink-900 line-clamp-1">{item.food.name}</h3>
                <button
                  onClick={() => removeFromCart(item.food.id)}
                  className="shrink-0 p-1.5 rounded-lg text-ink-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                  aria-label={`Remove ${item.food.name}`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-ink-500 mt-0.5">{item.food.location}</p>
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-1 bg-ink-100 rounded-full p-0.5">
                  <button
                    onClick={() => updateQuantity(item.food.id, item.quantity - 1)}
                    className="w-7 h-7 rounded-full bg-white flex items-center justify-center shadow-sm active:scale-90 transition-transform"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5 text-ink-700" />
                  </button>
                  <span className="w-7 text-center font-bold text-sm text-ink-900">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.food.id, item.quantity + 1)}
                    className="w-7 h-7 rounded-full bg-white flex items-center justify-center shadow-sm active:scale-90 transition-transform"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5 text-ink-700" />
                  </button>
                </div>
                <span className="font-extrabold text-ink-900">
                  ₹{item.food.price * item.quantity}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bill summary */}
      <div className="bg-white rounded-2xl p-4 shadow-card mb-4">
        <h2 className="font-bold text-sm text-ink-900 uppercase tracking-wide mb-3">
          Bill Details
        </h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-ink-600">
            <span>Subtotal</span>
            <span className="font-semibold">₹{subtotal}</span>
          </div>
          <div className="flex justify-between text-green-600">
            <span className="flex items-center gap-1">
              <Tag className="w-3.5 h-3.5" />
              Student Discount (10%)
            </span>
            <span className="font-semibold">−₹{discount}</span>
          </div>
          <div className="flex justify-between text-ink-600">
            <span>Delivery / Pickup</span>
            <span className="font-semibold text-green-600">FREE</span>
          </div>
          <div className="border-t border-ink-100 pt-2 flex justify-between text-base">
            <span className="font-extrabold text-ink-900">Total</span>
            <span className="font-extrabold text-ink-900">₹{total}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('menu')}
          className="flex-1 bg-white border border-ink-200 text-ink-700 rounded-full py-3.5 text-sm font-bold hover:border-ink-400 transition-colors active:scale-95"
        >
          Continue Shopping
        </button>
        <button
          onClick={() => navigate('checkout')}
          className="flex-[1.5] flex items-center justify-center gap-2 bg-ink-900 text-white rounded-full py-3.5 text-sm font-bold hover:bg-ink-800 transition-colors active:scale-95"
        >
          Checkout · ₹{total}
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
