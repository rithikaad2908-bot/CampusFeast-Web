import { useState } from 'react';
import {
  ArrowLeft,
  Star,
  Clock,
  MapPin,
  Plus,
  Minus,
  Heart,
  ShoppingBag,
  ChevronRight,
} from 'lucide-react';
import { useApp } from '@/context';
import { foodItems } from '@/data';
import { VegBadge } from '@/components/VegBadge';
import { RatingBadge } from '@/components/RatingBadge';
import { FoodCard } from '@/components/FoodCard';
import { toast } from '@/components/Toast';

export function FoodDetailPage() {
  const {
    selectedFoodId,
    navigate,
    addToCart,
    toggleFavorite,
    isFavorite,
    getFoodRatingInfo,
    getFoodUserReviews,
  } = useApp();
  const [quantity, setQuantity] = useState(1);

  const food = foodItems.find((f) => f.id === selectedFoodId);

  if (!food) {
    return (
      <div className="max-w-2xl mx-auto px-5 pt-10 text-center">
        <p className="text-ink-500">Item not found.</p>
        <button
          onClick={() => navigate('menu')}
          className="mt-4 text-brand-600 font-bold"
        >
          Back to Menu
        </button>
      </div>
    );
  }

  const relatedItems = foodItems
    .filter((f) => f.category === food.category && f.id !== food.id)
    .slice(0, 4);

  const ratingInfo = getFoodRatingInfo(food.id);
  const userReviews = getFoodUserReviews(food.id);

  const handleAddToCart = () => {
    addToCart(food, quantity);
    toast(`${quantity}× ${food.name} added to cart!`);
    navigate('cart');
  };

  return (
    <div className="max-w-4xl mx-auto px-0 md:px-5 pb-4">
      {/* Back button */}
      <div className="px-5 md:px-0 pt-4">
        <button
          onClick={() => navigate('menu')}
          className="flex items-center gap-1.5 text-sm font-bold text-ink-600 hover:text-ink-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Menu
        </button>
      </div>

      {/* Hero image */}
      <div className="relative mt-3 aspect-[16/10] md:aspect-[2/1] md:rounded-3xl overflow-hidden bg-ink-100">
        <img
          src={food.image}
          alt={food.name}
          className="w-full h-full object-cover"
        />
        <button
          onClick={() => toggleFavorite(food.id)}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md active:scale-90 transition-transform"
          aria-label={isFavorite(food.id) ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart
            className={`w-5 h-5 transition-all ${
              isFavorite(food.id) ? 'fill-red-500 text-red-500' : 'text-ink-600'
            }`}
          />
        </button>
      </div>

      <div className="px-5 md:px-0">
        {/* Info */}
        <div className="mt-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <h1 className="text-2xl font-extrabold text-ink-900">{food.name}</h1>
              <div className="flex items-center gap-2 mt-2">
                <VegBadge isVeg={food.isVeg} />
                <RatingBadge rating={ratingInfo.rating} ratingCount={ratingInfo.ratingCount} size="md" />
              </div>
            </div>
            <span className="text-2xl font-extrabold text-ink-900 shrink-0">₹{food.price}</span>
          </div>

          <p className="text-sm text-ink-600 mt-3 leading-relaxed">{food.longDescription}</p>

          {/* Meta info */}
          <div className="flex items-center gap-4 mt-4">
            <div className="flex items-center gap-1.5 text-ink-600">
              <Clock className="w-4 h-4 text-brand-500" />
              <span className="text-sm font-bold">{food.prepTime} min</span>
            </div>
            <div className="flex items-center gap-1.5 text-ink-600">
              <MapPin className="w-4 h-4 text-brand-500" />
              <span className="text-sm font-bold">{food.location}</span>
            </div>
          </div>

          {/* Ingredients */}
          <div className="mt-5">
            <h2 className="text-sm font-extrabold text-ink-900 uppercase tracking-wide mb-2">
              Ingredients
            </h2>
            <div className="flex flex-wrap gap-2">
              {food.ingredients.map((ing) => (
                <span
                  key={ing}
                  className="bg-ink-100 text-ink-700 rounded-full px-3 py-1 text-xs font-semibold"
                >
                  {ing}
                </span>
              ))}
            </div>
          </div>

          {/* Reviews */}
          <div className="mt-6">
            <h2 className="text-sm font-extrabold text-ink-900 uppercase tracking-wide mb-3">
              Reviews ({food.reviews.length + userReviews.length})
            </h2>
            <div className="space-y-3">
              {/* User-submitted reviews (shown first, clearly distinguished) */}
              {userReviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-brand-50 rounded-2xl p-4 border border-brand-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-brand-400 flex items-center justify-center text-xs font-bold text-ink-900">
                        {review.author.charAt(0)}
                      </div>
                      <div>
                        <span className="text-sm font-bold text-ink-900">{review.author}</span>
                        <span className="ml-2 text-[10px] font-bold text-brand-700 bg-brand-200 rounded-full px-2 py-0.5">
                          Your Review
                        </span>
                      </div>
                    </div>
                    <span className="text-xs text-ink-400">{review.date}</span>
                  </div>
                  <div className="flex items-center gap-1 mt-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i <= review.rating
                            ? 'text-brand-400 fill-brand-400'
                            : 'text-ink-200 fill-ink-200'
                        }`}
                      />
                    ))}
                  </div>
                  {review.comment && (
                    <p className="text-sm text-ink-600 mt-2 leading-relaxed">{review.comment}</p>
                  )}
                </div>
              ))}

              {/* Sample/demo reviews */}
              {food.reviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-white rounded-2xl p-4 shadow-card border border-ink-100"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-xs font-bold text-brand-700">
                        {review.author.charAt(0)}
                      </div>
                      <span className="text-sm font-bold text-ink-900">{review.author}</span>
                    </div>
                    <span className="text-xs text-ink-400">{review.date}</span>
                  </div>
                  <div className="flex items-center gap-1 mt-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i <= review.rating
                            ? 'text-brand-400 fill-brand-400'
                            : 'text-ink-200 fill-ink-200'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-ink-600 mt-2 leading-relaxed">{review.comment}</p>
                </div>
              ))}
              <p className="text-xs text-ink-400 italic px-1">
                Sample reviews shown for illustration — not from verified customers.
                {userReviews.length > 0 && ' Your submitted reviews appear above with a "Your Review" badge.'}
              </p>
            </div>
          </div>

          {/* Related items */}
          {relatedItems.length > 0 && (
            <div className="mt-6">
              <h2 className="text-sm font-extrabold text-ink-900 uppercase tracking-wide mb-3">
                You might also like
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {relatedItems.map((item) => (
                  <FoodCard key={item.id} food={item} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sticky add-to-cart bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-ink-200 p-4 pb-safe md:absolute md:rounded-t-3xl md:shadow-card-hover">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <div className="flex items-center gap-1 bg-ink-100 rounded-full p-1">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-sm active:scale-90 transition-transform"
              aria-label="Decrease quantity"
            >
              <Minus className="w-4 h-4 text-ink-700" />
            </button>
            <span className="w-8 text-center font-extrabold text-ink-900">{quantity}</span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-sm active:scale-90 transition-transform"
              aria-label="Increase quantity"
            >
              <Plus className="w-4 h-4 text-ink-700" />
            </button>
          </div>
          <button
            onClick={handleAddToCart}
            className="flex-1 flex items-center justify-center gap-2 bg-brand-400 hover:bg-brand-500 text-ink-900 rounded-full py-3.5 font-bold transition-colors active:scale-95"
          >
            <ShoppingBag className="w-5 h-5" />
            Add to Cart · ₹{food.price * quantity}
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Spacer for sticky bar */}
      <div className="h-20" />
    </div>
  );
}
