import { CheckCircle2, Clock, Package, ChefHat, Bell, Home } from 'lucide-react';
import { useApp } from '@/context';
import { RateOrder } from '@/components/StarRating';
import type { Order, OrderStatus } from '@/types';

const statusFlow: { status: OrderStatus; label: string; icon: typeof CheckCircle2; desc: string }[] = [
  { status: 'placed', label: 'Order Placed', icon: CheckCircle2, desc: 'We received your order' },
  { status: 'preparing', label: 'Preparing', icon: ChefHat, desc: 'Your food is being cooked' },
  { status: 'ready', label: 'Ready for Pickup', icon: Bell, desc: 'Collect your order now' },
  { status: 'completed', label: 'Completed', icon: Package, desc: 'Order finished. Enjoy!' },
];

export function TrackingPage() {
  const { orders, navigate, advanceOrderStatus, profile } = useApp();

  // Use the most recent non-completed order, or the most recent order
  const activeOrder =
    orders.find((o) => o.status !== 'completed') ?? orders[0];

  if (!activeOrder) {
    return (
      <div className="max-w-2xl mx-auto px-5 pt-10 text-center">
        <p className="text-ink-500">No order to track.</p>
        <button onClick={() => navigate('home')} className="mt-4 text-brand-600 font-bold">
          Go Home
        </button>
      </div>
    );
  }

  const currentIndex = statusFlow.findIndex((s) => s.status === activeOrder.status);

  return (
    <div className="max-w-2xl mx-auto px-5 pt-6 pb-4">
      <h1 className="text-2xl font-extrabold text-ink-900 mb-1">Track Order</h1>
      <p className="text-sm text-ink-500 mb-5">Order #{activeOrder.id}</p>

      {/* ETA */}
      <div className="bg-gradient-to-r from-brand-50 to-brand-100 rounded-2xl p-4 mb-5 flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-brand-400 flex items-center justify-center shrink-0">
          <Clock className="w-7 h-7 text-ink-900" />
        </div>
        <div>
          <p className="text-xs font-bold text-brand-700 uppercase tracking-wide">
            Estimated Time
          </p>
          <p className="text-2xl font-extrabold text-ink-900">
            {activeOrder.estimatedTime} min
          </p>
          <p className="text-xs text-ink-600">
            {activeOrder.fulfillment === 'pickup'
              ? `Pickup at ${activeOrder.campus} — ${activeOrder.block}`
              : `Delivery to ${activeOrder.block}`}
          </p>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-white rounded-2xl p-5 shadow-card mb-5">
        <div className="relative">
          {statusFlow.map((step, i) => {
            const Icon = step.icon;
            const isDone = i < currentIndex;
            const isActive = i === currentIndex;
            const isUpcoming = i > currentIndex;

            return (
              <div key={step.status} className="flex gap-4 relative">
                {/* Line connector */}
                {i < statusFlow.length - 1 && (
                  <div
                    className={`absolute left-5 top-12 w-0.5 h-12 ${
                      isDone ? 'bg-green-500' : 'bg-ink-200'
                    }`}
                  />
                )}

                {/* Icon */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 z-10 transition-all ${
                    isDone
                      ? 'bg-green-500 text-white'
                      : isActive
                        ? 'bg-brand-400 text-ink-900 animate-pulse-soft'
                        : 'bg-ink-100 text-ink-400'
                  }`}
                >
                  <Icon className="w-5 h-5" strokeWidth={2.5} />
                </div>

                {/* Content */}
                <div className={`pb-6 ${isUpcoming ? 'opacity-50' : ''}`}>
                  <p
                    className={`text-sm font-bold ${
                      isDone || isActive ? 'text-ink-900' : 'text-ink-500'
                    }`}
                  >
                    {step.label}
                  </p>
                  <p className="text-xs text-ink-500 mt-0.5">{step.desc}</p>
                  {isActive && (
                    <span className="inline-flex items-center gap-1 mt-1.5 text-[10px] font-bold text-brand-600 bg-brand-50 rounded-full px-2 py-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
                      In Progress
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Order items quick view */}
      <div className="bg-white rounded-2xl p-4 shadow-card mb-5">
        <h2 className="font-bold text-sm text-ink-900 uppercase tracking-wide mb-3">
          Items in this order
        </h2>
        <div className="space-y-2">
          {activeOrder.items.map((item) => (
            <div key={item.food.id} className="flex items-center gap-3">
              <img
                src={item.food.image}
                alt={item.food.name}
                className="w-10 h-10 rounded-lg object-cover"
              />
              <span className="flex-1 text-sm font-semibold text-ink-800 line-clamp-1">
                {item.quantity}× {item.food.name}
              </span>
              <span className="text-sm font-bold text-ink-900">
                ₹{item.food.price * item.quantity}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Rate order section - only after completed */}
      {activeOrder.status === 'completed' && (
        <div className="mb-4">
          <RateOrder orderId={activeOrder.id} author={profile.name} onSubmitted={() => {}} />
        </div>
      )}

      {/* Demo advance button */}
      {activeOrder.status !== 'completed' && (
        <button
          onClick={() => advanceOrderStatus(activeOrder.id)}
          className="w-full bg-ink-100 text-ink-700 rounded-full py-3 text-sm font-bold hover:bg-ink-200 transition-colors active:scale-95 mb-3"
        >
          Simulate Next Status (Demo)
        </button>
      )}

      <button
        onClick={() => navigate('home')}
        className="w-full flex items-center justify-center gap-2 bg-ink-900 text-white rounded-full py-3.5 font-bold hover:bg-ink-800 transition-colors active:scale-95"
      >
        <Home className="w-4 h-4" />
        Back to Home
      </button>
    </div>
  );
}
