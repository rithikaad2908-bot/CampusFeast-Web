import { Star, Clock, Plus, Leaf } from 'lucide-react';
import type { FoodItem } from '@/types';
import { useApp } from '@/context';

interface FoodCardProps {
  food: FoodItem;
  onCardClick?: () => void;
}

export function FoodCard({ food, onCardClick }: FoodCardProps) {
  const { addToCart, navigate, getFoodRatingInfo } = useApp();
  const ratingInfo = getFoodRatingInfo(food.id);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(food, 1);
  };

  const handleClick = () => {
    if (onCardClick) onCardClick();
    else navigate('food-detail', food.id);
  };

  return (
    <article
      onClick={handleClick}
      className="group bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 cursor-pointer hover:-translate-y-0.5"
    >
      <div className="relative aspect-square overflow-hidden bg-ink-100">
        <img
          src={food.image}
          alt={food.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
          {food.isVeg ? (
            <span className="flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-full pl-1 pr-2 py-0.5 text-xs font-semibold text-green-700">
              <Leaf className="w-3 h-3" />
              Veg
            </span>
          ) : (
            <span className="bg-white/90 backdrop-blur-sm rounded-full px-2 py-0.5 text-xs font-semibold text-ink-700">
              Non-Veg
            </span>
          )}
        </div>
        <div className="absolute top-2.5 right-2.5 flex items-center gap-1 bg-ink-900/85 backdrop-blur-sm rounded-full px-2 py-0.5 text-xs font-bold text-white">
          <Star className="w-3 h-3 text-brand-400 fill-brand-400" />
          {ratingInfo.rating.toFixed(1)}
        </div>
      </div>

      <div className="p-3.5">
        <h3 className="font-bold text-sm text-ink-900 line-clamp-1">{food.name}</h3>
        <p className="text-xs text-ink-500 mt-0.5 line-clamp-2 leading-snug min-h-[2rem]">
          {food.description}
        </p>
        <div className="flex items-center gap-1.5 mt-2 text-ink-400">
          <Clock className="w-3.5 h-3.5" />
          <span className="text-xs font-medium">{food.prepTime} min</span>
        </div>
        <div className="flex items-center justify-between mt-3">
          <span className="text-lg font-extrabold text-ink-900">
            ₹{food.price}
          </span>
          <button
            onClick={handleAdd}
            className="flex items-center gap-1 bg-brand-400 hover:bg-brand-500 text-ink-900 rounded-full px-3 py-1.5 text-sm font-bold transition-colors active:scale-90"
            aria-label={`Add ${food.name} to cart`}
          >
            <Plus className="w-4 h-4" strokeWidth={2.5} />
            Add
          </button>
        </div>
      </div>
    </article>
  );
}
