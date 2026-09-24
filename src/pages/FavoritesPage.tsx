import { Heart } from 'lucide-react';
import { useApp } from '@/context';
import { foodItems } from '@/data';
import { FoodCard } from '@/components/FoodCard';
import { EmptyState } from '@/components/EmptyState';

export function FavoritesPage() {
  const { favorites, navigate } = useApp();

  const favoriteItems = foodItems.filter((f) => favorites.includes(f.id));

  return (
    <div className="max-w-2xl md:max-w-6xl mx-auto px-5 pt-6 pb-4">
      <h1 className="text-2xl font-extrabold text-ink-900 mb-1">Favorites</h1>
      <p className="text-sm text-ink-500 mb-5">
        {favoriteItems.length > 0
          ? `${favoriteItems.length} saved item${favoriteItems.length !== 1 ? 's' : ''}`
          : 'Your favourite foods will appear here'}
      </p>

      {favoriteItems.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 stagger">
          {favoriteItems.map((food) => (
            <FoodCard key={food.id} food={food} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Heart}
          title="No favourites yet"
          description="Tap the heart icon on any food item to save it here for quick access."
          actionLabel="Browse Menu"
          onAction={() => navigate('menu')}
        />
      )}
    </div>
  );
}
