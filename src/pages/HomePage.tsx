import { Search, ArrowRight, Flame, Tag, Clock, TrendingUp } from 'lucide-react';
import { useApp } from '@/context';
import { categories, deals, foodItems, heroImage } from '@/data';
import { FoodCard } from '@/components/FoodCard';
import { CategoryCard, SectionHeader } from '@/components/Category';
import { CampusSelector } from '@/components/CampusSelector';
import { toast } from '@/components/Toast';

export function HomePage() {
  const { navigate, popularItems, selectedCampus, addToCart } = useApp();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const value = (e.currentTarget.elements.namedItem('search') as HTMLInputElement).value;
    navigate('menu');
    // Pass search via a global hack-free approach: set a data attribute
    window.dispatchEvent(new CustomEvent('cf-search', { detail: value }));
  };

  const campusDeals = deals;
  const popularNearYou = foodItems.filter((f) => f.popular).slice(0, 6);

  return (
    <div className="pb-4">
      {/* Hero */}
      <section className="relative overflow-hidden bg-ink-900">
        <img
          src={heroImage}
          alt="Campus food"
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink-950/60 via-ink-900/70 to-ink-900" />
        <div className="relative max-w-6xl mx-auto px-5 pt-8 pb-10 md:pt-14 md:pb-16">
          <div className="max-w-2xl">
            <p className="text-brand-400 font-bold text-sm tracking-wide uppercase mb-2 animate-fade-in">
              Good Food. Campus Vibes.
            </p>
            <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight animate-fade-in-up">
              Your campus food,
              <br />
              just a few taps away.
            </h1>
            <p className="text-ink-300 mt-3 text-sm md:text-base max-w-md animate-fade-in-up">
              Order from canteens, food courts, and cafes across your campus. Quick pickup, student
              deals, and zero delivery fees.
            </p>

            {/* Search bar */}
            <form onSubmit={handleSearch} className="mt-5 flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-400" />
                <input
                  name="search"
                  type="text"
                  placeholder="Search for food, snacks or drinks..."
                  className="w-full bg-white rounded-full pl-11 pr-4 py-3.5 text-sm font-medium text-ink-800 placeholder:text-ink-400 shadow-lg focus:outline-none focus:ring-2 focus:ring-brand-400"
                />
              </div>
              <button
                type="submit"
                className="bg-brand-400 hover:bg-brand-500 text-ink-900 rounded-full px-5 py-3.5 text-sm font-bold transition-colors active:scale-95 shrink-0"
              >
                Search
              </button>
            </form>

            <button
              onClick={() => navigate('menu')}
              className="mt-4 inline-flex items-center gap-2 bg-white text-ink-900 rounded-full px-6 py-3 text-sm font-bold hover:bg-ink-100 transition-colors active:scale-95 animate-fade-in-up"
            >
              Order Now
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-5">
        {/* Campus Selector */}
        <div className="-mt-6 relative z-10 mb-6">
          <CampusSelector />
        </div>

        {/* Categories */}
        <section className="mb-8">
          <SectionHeader title="Categories" subtitle="What are you craving today?" />
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 -mx-1 px-1">
            {categories.map((cat) => (
              <CategoryCard
                key={cat.id}
                category={cat}
                onClick={() => {
                  navigate('menu');
                  window.dispatchEvent(new CustomEvent('cf-category', { detail: cat.id }));
                }}
              />
            ))}
          </div>
        </section>

        {/* Campus Deals */}
        <section className="mb-8">
          <SectionHeader
            title="Campus Deals"
            subtitle="Student-only offers and combo discounts"
            actionLabel="See all"
            onAction={() => navigate('menu')}
          />
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 -mx-1 px-1">
            {campusDeals.map((deal) => (
              <div
                key={deal.id}
                className="shrink-0 w-64 bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all"
              >
                <div className="relative h-28 overflow-hidden">
                  <img
                    src={deal.image}
                    alt={deal.title}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-2 left-2 flex items-center gap-1 bg-brand-400 text-ink-900 rounded-full px-2.5 py-1 text-[10px] font-extrabold tracking-wide">
                    <Tag className="w-3 h-3" />
                    {deal.tag}
                  </span>
                </div>
                <div className="p-3">
                  <h3 className="font-bold text-sm text-ink-900">{deal.title}</h3>
                  <p className="text-xs text-ink-500 mt-0.5">{deal.items}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-lg font-extrabold text-ink-900">₹{deal.price}</span>
                    <span className="text-sm text-ink-400 line-through">₹{deal.originalPrice}</span>
                    <span className="text-xs font-bold text-green-600">
                      Save ₹{deal.originalPrice - deal.price}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      const dealFood = foodItems.find((f) =>
                        deal.items.toLowerCase().includes(f.name.toLowerCase())
                      );
                      if (dealFood) {
                        addToCart(dealFood, 1);
                        toast(`${deal.title} added to cart!`);
                      } else {
                        toast(`${deal.title} — head to menu to order!`);
                        navigate('menu');
                      }
                    }}
                    className="mt-2.5 w-full bg-ink-900 text-white rounded-lg py-2 text-xs font-bold hover:bg-ink-800 transition-colors active:scale-95"
                  >
                    Grab Deal
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Popular on Campus */}
        <section className="mb-8">
          <SectionHeader
            title="Popular on Campus"
            subtitle={`Trending at ${selectedCampus} right now`}
            actionLabel="View all"
            onAction={() => navigate('menu')}
          />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {popularItems.slice(0, 4).map((food) => (
              <FoodCard key={food.id} food={food} />
            ))}
          </div>
        </section>

        {/* Popular Near You */}
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-5 h-5 text-brand-500" />
            <h2 className="text-lg md:text-xl font-extrabold text-ink-900">Popular Near You</h2>
          </div>
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 -mx-1 px-1">
            {popularNearYou.map((food) => (
              <div key={food.id} className="shrink-0 w-44">
                <FoodCard food={food} />
              </div>
            ))}
          </div>
        </section>

        {/* Quick reorder */}
        <QuickReorder />

        {/* Recommended */}
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Flame className="w-5 h-5 text-brand-500" />
            <h2 className="text-lg md:text-xl font-extrabold text-ink-900">Recommended For You</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {useApp().recommendedItems.slice(0, 4).map((food) => (
              <FoodCard key={food.id} food={food} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function QuickReorder() {
  const { orders, navigate, addToCart } = useApp();
  const recentOrder = orders[0];

  if (!recentOrder || recentOrder.items.length === 0) return null;

  return (
    <section className="mb-8">
      <div className="flex items-center gap-2 mb-3">
        <Clock className="w-5 h-5 text-brand-500" />
        <h2 className="text-lg md:text-xl font-extrabold text-ink-900">Quick Reorder</h2>
      </div>
      <div className="bg-gradient-to-r from-brand-50 to-brand-100 rounded-2xl p-4 flex items-center gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-brand-700 uppercase tracking-wide">Last order</p>
          <p className="text-sm font-bold text-ink-900 mt-1 truncate">
            {recentOrder.items.map((i) => `${i.quantity}× ${i.food.name}`).join(', ')}
          </p>
          <p className="text-xs text-ink-500 mt-0.5">
            Order #{recentOrder.id} · ₹{recentOrder.total}
          </p>
        </div>
        <button
          onClick={() => {
            recentOrder.items.forEach((item) => addToCart(item.food, item.quantity));
            toast('Items added to cart!');
            navigate('cart');
          }}
          className="shrink-0 bg-ink-900 text-white rounded-full px-4 py-2.5 text-sm font-bold hover:bg-ink-800 transition-colors active:scale-95"
        >
          Reorder
        </button>
      </div>
    </section>
  );
}
