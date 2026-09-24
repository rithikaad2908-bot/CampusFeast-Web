import { useState } from 'react';
import { Receipt, ChevronRight, Repeat, MapPin, Clock, Star } from 'lucide-react';
import { useApp } from '@/context';
import { EmptyState } from '@/components/EmptyState';
import { Modal } from '@/components/Modal';
import { RateOrder } from '@/components/StarRating';
import type { OrderStatus } from '@/types';

const statusColors: Record<OrderStatus, string> = {
  placed: 'bg-blue-100 text-blue-700',
  preparing: 'bg-amber-100 text-amber-700',
  ready: 'bg-green-100 text-green-700',
  completed: 'bg-ink-100 text-ink-600',
};

const statusLabels: Record<OrderStatus, string> = {
  placed: 'Order Placed',
  preparing: 'Preparing',
  ready: 'Ready',
  completed: 'Completed',
};

export function OrdersPage() {
  const { orders, navigate, addToCart, recentlyOrderedFoodIds, profile, isOrderRated } = useApp();
  const [rateOrderId, setRateOrderId] = useState<string | null>(null);

  return (
    <div className="max-w-2xl mx-auto px-5 pt-6 pb-4">
      <h1 className="text-2xl font-extrabold text-ink-900 mb-1">Orders</h1>
      <p className="text-sm text-ink-500 mb-5">Your order history and recently ordered items</p>

      {/* Recently ordered */}
      {recentlyOrderedFoodIds.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-4 h-4 text-brand-500" />
            <h2 className="text-sm font-extrabold text-ink-900 uppercase tracking-wide">
              Recently Ordered
            </h2>
          </div>
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 -mx-1 px-1">
            {recentlyOrderedFoodIds.map((id) => {
              const item = orders.flatMap((o) => o.items).find((i) => i.food.id === id)?.food;
              if (!item) return null;
              return (
                <button
                  key={id}
                  onClick={() => navigate('food-detail', id)}
                  className="shrink-0 flex items-center gap-2 bg-white rounded-full pr-4 pl-1 py-1 shadow-card border border-ink-100 active:scale-95 transition-transform"
                >
                  <img src={item.image} alt={item.name} className="w-10 h-10 rounded-full object-cover" />
                  <div className="text-left">
                    <p className="text-xs font-bold text-ink-900 line-clamp-1 max-w-[100px]">{item.name}</p>
                    <p className="text-[10px] text-ink-500">₹{item.price}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Orders list */}
      {orders.length > 0 ? (
        <div className="space-y-3">
          <h2 className="text-sm font-extrabold text-ink-900 uppercase tracking-wide">
            All Orders
          </h2>
          {orders.map((order) => {
            const rated = isOrderRated(order.id);
            return (
              <div
                key={order.id}
                className="bg-white rounded-2xl p-4 shadow-card"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-bold text-sm text-ink-900">Order #{order.id}</p>
                    <p className="text-xs text-ink-500 mt-0.5">
                      {new Date(order.placedAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  <span
                    className={`text-[10px] font-bold rounded-full px-2.5 py-1 ${statusColors[order.status]}`}
                  >
                    {statusLabels[order.status]}
                  </span>
                </div>

                {/* Food items */}
                <div className="flex items-center gap-1.5 mb-3">
                  {order.items.slice(0, 3).map((item) => (
                    <img
                      key={item.food.id}
                      src={item.food.image}
                      alt={item.food.name}
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                  ))}
                  {order.items.length > 3 && (
                    <div className="w-10 h-10 rounded-lg bg-ink-100 flex items-center justify-center text-xs font-bold text-ink-500">
                      +{order.items.length - 3}
                    </div>
                  )}
                </div>

                {/* Food item names */}
                <p className="text-xs text-ink-600 font-medium mb-2 line-clamp-1">
                  {order.items.map((i) => `${i.quantity}× ${i.food.name}`).join(', ')}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-ink-500">
                    <MapPin className="w-3.5 h-3.5" />
                    {order.campus} — {order.block}
                  </div>
                  <span className="font-extrabold text-ink-900">₹{order.total}</span>
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-ink-100">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      order.items.forEach((item) => addToCart(item.food, item.quantity));
                      navigate('cart');
                    }}
                    className="flex items-center gap-1.5 text-xs font-bold text-brand-600 hover:text-brand-700"
                  >
                    <Repeat className="w-3.5 h-3.5" />
                    Reorder
                  </button>

                  {/* Rate Order / Rated indicator */}
                  {order.status === 'completed' && !rated && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setRateOrderId(order.id);
                      }}
                      className="flex items-center gap-1.5 ml-auto text-xs font-bold text-ink-700 bg-brand-50 rounded-full px-3 py-1.5 hover:bg-brand-100 transition-colors"
                    >
                      <Star className="w-3.5 h-3.5 text-brand-500" />
                      Rate Order
                    </button>
                  )}
                  {order.status === 'completed' && rated && (
                    <span className="flex items-center gap-1 ml-auto text-xs font-bold text-green-600">
                      <Star className="w-3.5 h-3.5 fill-green-500 text-green-500" />
                      Rated
                    </span>
                  )}

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate('tracking', null);
                    }}
                    className="flex items-center gap-1 text-xs font-bold text-ink-500 hover:text-ink-800"
                  >
                    Track
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={Receipt}
          title="No orders yet"
          description="Your order history will appear here once you place your first order."
          actionLabel="Start Ordering"
          onAction={() => navigate('menu')}
        />
      )}

      {/* Rate Order Modal */}
      <Modal
        open={rateOrderId !== null}
        onClose={() => setRateOrderId(null)}
        title="Rate Your Order"
      >
        {rateOrderId && (
          <RateOrder
            orderId={rateOrderId}
            author={profile.name}
            onSubmitted={() => {
              setTimeout(() => setRateOrderId(null), 1500);
            }}
          />
        )}
      </Modal>
    </div>
  );
}
