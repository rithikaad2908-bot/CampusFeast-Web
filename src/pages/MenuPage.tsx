import { useMemo, useState, useEffect } from 'react';
import { Search, SlidersHorizontal, X, Star, Clock } from 'lucide-react';
import { useApp } from '@/context';
import { categories, foodItems } from '@/data';
import { FoodCard } from '@/components/FoodCard';
import { CategoryPill } from '@/components/Category';
import { EmptyState } from '@/components/EmptyState';
import { Modal } from '@/components/Modal';
import type { CategoryId } from '@/types';

type SortOption = 'none' | 'price-low' | 'price-high' | 'rating-high';

export function MenuPage() {
  const { navigate } = useApp();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<CategoryId | 'all'>('all');
  const [vegOnly, setVegOnly] = useState(false);
  const [sort, setSort] = useState<SortOption>('none');
  const [filterOpen, setFilterOpen] = useState(false);

  // Listen for events from home page
  useEffect(() => {
    const handleSearch = (e: Event) => {
      setSearch((e as CustomEvent).detail);
    };
    const handleCategory = (e: Event) => {
      setActiveCategory((e as CustomEvent).detail as CategoryId);
    };
    window.addEventListener('cf-search', handleSearch);
    window.addEventListener('cf-category', handleCategory);
    return () => {
      window.removeEventListener('cf-search', handleSearch);
      window.removeEventListener('cf-category', handleCategory);
    };
  }, []);

  const filteredItems = useMemo(() => {
    let items = [...foodItems];

    // Search
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      items = items.filter(
        (f) =>
          f.name.toLowerCase().includes(q) ||
          f.description.toLowerCase().includes(q) ||
          f.category.toLowerCase().includes(q)
      );
    }

    // Category
    if (activeCategory !== 'all') {
      items = items.filter((f) => f.category === activeCategory);
    }

    // Veg only
    if (vegOnly) {
      items = items.filter((f) => f.isVeg);
    }

    // Sort
    switch (sort) {
      case 'price-low':
        items.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        items.sort((a, b) => b.price - a.price);
        break;
      case 'rating-high':
        items.sort((a, b) => b.rating - a.rating);
        break;
    }

    return items;
  }, [search, activeCategory, vegOnly, sort]);

  const activeFiltersCount = (vegOnly ? 1 : 0) + (sort !== 'none' ? 1 : 0);

  return (
    <div className="max-w-6xl mx-auto px-5 pb-4">
      <div className="pt-5 md:pt-8">
        <h1 className="text-2xl md:text-3xl font-extrabold text-ink-900 mb-1">Menu</h1>
        <p className="text-sm text-ink-500 mb-4">
          {filteredItems.length} item{filteredItems.length !== 1 ? 's' : ''} available
        </p>

        {/* Search bar */}
        <div className="relative mb-3">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search for food, snacks or drinks..."
            className="w-full bg-white border border-ink-200 rounded-full pl-11 pr-10 py-3 text-sm font-medium text-ink-800 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-ink-100"
              aria-label="Clear search"
            >
              <X className="w-4 h-4 text-ink-400" />
            </button>
          )}
        </div>

        {/* Category pills */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 mb-3 -mx-1 px-1">
          <CategoryPill
            category={{ id: 'all' as CategoryId, name: 'All', icon: '', description: '' }}
            active={activeCategory === 'all'}
            onClick={() => setActiveCategory('all')}
          />
          {categories.map((cat) => (
            <CategoryPill
              key={cat.id}
              category={cat}
              active={activeCategory === cat.id}
              onClick={() => setActiveCategory(cat.id)}
            />
          ))}
        </div>

        {/* Filter bar */}
        <div className="flex items-center gap-2 mb-4">
          <button
            onClick={() => setFilterOpen(true)}
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition-all ${
              activeFiltersCount > 0
                ? 'bg-ink-900 text-white'
                : 'bg-white border border-ink-200 text-ink-600'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
            {activeFiltersCount > 0 && (
              <span className="bg-brand-400 text-ink-900 rounded-full w-5 h-5 text-[10px] flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </button>
          {vegOnly && (
            <button
              onClick={() => setVegOnly(false)}
              className="flex items-center gap-1 bg-green-50 text-green-700 rounded-full px-3 py-2 text-sm font-bold"
            >
              Veg Only
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          {sort !== 'none' && (
            <button
              onClick={() => setSort('none')}
              className="flex items-center gap-1 bg-ink-100 text-ink-700 rounded-full px-3 py-2 text-sm font-bold"
            >
              {sort === 'price-low' && 'Price: Low to High'}
              {sort === 'price-high' && 'Price: High to Low'}
              {sort === 'rating-high' && 'Top Rated'}
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Results */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 stagger">
            {filteredItems.map((food) => (
              <FoodCard key={food.id} food={food} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Search}
            title="No items found"
            description="Try adjusting your search or filters to find what you're looking for."
            actionLabel="Browse all food"
            onAction={() => {
              setSearch('');
              setActiveCategory('all');
              setVegOnly(false);
              setSort('none');
            }}
          />
        )}
      </div>

      <FilterModal
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        vegOnly={vegOnly}
        setVegOnly={setVegOnly}
        sort={sort}
        setSort={setSort}
      />
    </div>
  );
}

function FilterModal({
  open,
  onClose,
  vegOnly,
  setVegOnly,
  sort,
  setSort,
}: {
  open: boolean;
  onClose: () => void;
  vegOnly: boolean;
  setVegOnly: (v: boolean) => void;
  sort: SortOption;
  setSort: (v: SortOption) => void;
}) {
  const sortOptions: { value: SortOption; label: string; icon: typeof Star }[] = [
    { value: 'none', label: 'Default', icon: Star },
    { value: 'price-low', label: 'Price: Low to High', icon: Star },
    { value: 'price-high', label: 'Price: High to Low', icon: Star },
    { value: 'rating-high', label: 'Top Rated', icon: Star },
  ];

  return (
    <Modal open={open} onClose={onClose} title="Filters & Sorting">
      <div className="space-y-5">
        <div>
          <label className="text-sm font-bold text-ink-700 mb-2 block">Dietary</label>
          <button
            onClick={() => setVegOnly(!vegOnly)}
            className={`flex items-center gap-3 w-full rounded-xl border p-3 transition-all ${
              vegOnly ? 'border-green-500 bg-green-50' : 'border-ink-200'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                vegOnly ? 'bg-green-500 border-green-500' : 'border-ink-300'
              }`}
            >
              {vegOnly && <span className="text-white text-xs">✓</span>}
            </div>
            <span className="text-sm font-bold text-ink-800">Veg Only</span>
          </button>
        </div>

        <div>
          <label className="text-sm font-bold text-ink-700 mb-2 block">Sort By</label>
          <div className="space-y-2">
            {sortOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setSort(opt.value)}
                className={`flex items-center gap-3 w-full rounded-xl border p-3 transition-all ${
                  sort === opt.value ? 'border-brand-400 bg-brand-50' : 'border-ink-200'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                    sort === opt.value ? 'border-brand-500 bg-brand-400' : 'border-ink-300'
                  }`}
                >
                  {sort === opt.value && <div className="w-2 h-2 rounded-full bg-ink-900" />}
                </div>
                <span className="text-sm font-bold text-ink-800">{opt.label}</span>
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full bg-ink-900 text-white rounded-xl py-3.5 font-bold transition-colors active:scale-95"
        >
          Apply Filters
        </button>
      </div>
    </Modal>
  );
}
