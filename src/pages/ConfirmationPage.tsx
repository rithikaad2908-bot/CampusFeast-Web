import { useEffect, useState } from 'react';
import {
  CheckCircle2,
  Clock,
  MapPin,
  Package,
  Truck,
  Home,
  ChevronRight,
  Star,
} from 'lucide-react';
import { useApp } from '@/context';
import { RateOrder } from '@/components/StarRating';
import type { Order } from '@/types';

export function ConfirmationPage() {
  const { orders, navigate, clearCart, profile, isOrderRated } = useApp();
  const [order, setOrder] = useState<Order | null>(null);
  const [showRateSection, setShowRateSection] = useState(false);

  useEffect(() => {
    // Get the most recent order, or listen for the event
    const handler = (e: Event) => {
      const id = (e as CustomEvent).detail as string;
      const o = orders.find((o) => o.id === id);
      if (o) {
        setOrder(o);
        clearCart();
      }
    };
    window.addEventListener('cf-order-placed', handler);

    // Also check if the most recent order is a fresh one
    if (!order && orders.length > 0) {
      const latest = orders[0];
      const placedRecently = Date.now() - new Date(latest.placedAt).getTime() < 60000;
      if (placedRecently) {
        setOrder(latest);
        clearCart();
      }
    }

    return () => window.removeEventListener('cf-order-placed', handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orders]);

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto px-5 pt-10 text-center">
        <p className="text-ink-500">No recent order found.</p>
        <button
          onClick={() => navigate('home')}
          className="mt-4 text-brand-600 font-bold"
        >
          Go Home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-5 pt-6 pb-4">
      {/* Success header */}
      <div className="text-center mb-6 animate-scale-in">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-12 h-12 text-green-500" strokeWidth={2} />
        </div>
        <h1 className="text-2xl font-extrabold text-ink-900">Order Confirmed!</h1>
        <p className="text-sm text-ink-500 mt-1">
          Your food is being prepared. We'll let you know when it's ready.
        </p>
      </div>

      {/* Order ID & ETA */}
      <div className="bg-white rounded-2xl p-4 shadow-card mb-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-xs text-ink-500 font-medium">Order ID</p>
            <p className="text-lg font-extrabold text-ink-900">#{order.id}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-ink-500 font-medium flex items-center gap-1 justify-end">
              <Clock className="w-3.5 h-3.5" />
              Est. Time
            </p>
            <p className="text-lg font-extrabold text-brand-600">{order.estimatedTime} min</p>
          </div>
        </div>

        {/* Status timeline preview */}
        <div className="flex items-center gap-1 mt-4">
          {['Placed', 'Preparing', 'Ready', 'Completed'].map((step, i) => (
            <div key={step} className="flex-1 flex items-center gap-1">
              <div
                className={`flex-1 h-2 rounded-full ${
                  i === 0 ? 'bg-green-500' : 'bg-ink-100'
                }`}
              />
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between mt-1.5">
          {['Placed', 'Preparing', 'Ready', 'Done'].map((step, i) => (
            <span
              key={step}
              className={`text-[10px] font-bold ${i === 0 ? 'text-green-600' : 'text-ink-400'}`}
            >
              {step}
            </span>
          ))}
        </div>
      </div>

      {/* Pickup/Delivery location */}
      <div className="bg-white rounded-2xl p-4 shadow-card mb-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center shrink-0">
            {order.fulfillment === 'pickup' ? (
              <Package className="w-5 h-5 text-brand-600" />
            ) : (
              <Truck className="w-5 h-5 text-brand-600" />
            )}
          </div>
          <div>
            <p className="text-sm font-bold text-ink-900">
              {order.fulfillment === 'pickup' ? 'Pickup from' : 'Delivery to'}
            </p>
            <p className="text-sm text-ink-600 flex items-center gap-1 mt-0.5">
              <MapPin className="w-4 h-4 text-ink-400" />
              {order.campus} — {order.block}
            </p>
          </div>
        </div>
      </div>

      {/* Order summary */}
      <div className="bg-white rounded-2xl p-4 shadow-card mb-4">
        <h2 className="font-bold text-sm text-ink-900 uppercase tracking-wide mb-3">
          Order Summary
        </h2>
        <div className="space-y-2 mb-3">
          {order.items.map((item) => (
            <div key={item.food.id} className="flex items-center gap-3">
              <img
                src={item.food.image}
                alt={item.food.name}
                className="w-12 h-12 rounded-lg object-cover"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-ink-900 line-clamp-1">{item.food.name}</p>
                <p className="text-xs text-ink-500">Qty: {item.quantity}</p>
              </div>
              <span className="text-sm font-bold text-ink-900">
                ₹{item.food.price * item.quantity}
              </span>
            </div>
          ))}
        </div>
        <div className="border-t border-ink-100 pt-3 space-y-1.5 text-sm">
          <div className="flex justify-between text-ink-500">
            <span>Subtotal</span>
            <span>₹{order.subtotal}</span>
          </div>
          <div className="flex justify-between text-green-600">
            <span>Student Discount</span>
            <span>−₹{order.discount}</span>
          </div>
          <div className="flex justify-between font-extrabold text-ink-900 text-base pt-1">
            <span>Total Paid</span>
            <span>₹{order.total}</span>
          </div>
          <p className="text-xs text-ink-400 pt-1">
            Paid via{' '}
            {order.paymentMethod === 'upi' && 'UPI'}
            {order.paymentMethod === 'cash' && 'Cash'}
            {order.paymentMethod === 'card' && 'Card'} (demo)
          </p>
        </div>
      </div>

      {/* Rate Your Order section */}
      {showRateSection && order && (
        <div className="mb-4 animate-fade-in-up">
          <RateOrder
            orderId={order.id}
            author={profile.name || 'Student'}
            onSubmitted={() => {}}
          />
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('home')}
          className="flex-1 bg-white border border-ink-200 text-ink-700 rounded-full py-3.5 text-sm font-bold hover:border-ink-400 transition-colors active:scale-95"
        >
          <Home className="w-4 h-4 inline mr-1.5" />
          Back to Home
        </button>
        {order && !isOrderRated(order.id) && !showRateSection ? (
          <button
            onClick={() => setShowRateSection(true)}
            className="flex-[1.5] flex items-center justify-center gap-2 bg-brand-400 text-ink-900 rounded-full py-3.5 text-sm font-bold hover:bg-brand-500 transition-colors active:scale-95"
          >
            <Star className="w-4 h-4 fill-ink-900" />
            Rate Your Order
          </button>
        ) : (
          <button
            onClick={() => navigate('tracking', null)}
            className="flex-[1.5] flex items-center justify-center gap-2 bg-ink-900 text-white rounded-full py-3.5 text-sm font-bold hover:bg-ink-800 transition-colors active:scale-95"
          >
            Track Order
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
