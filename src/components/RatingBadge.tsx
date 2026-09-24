import { Star } from 'lucide-react';

export function RatingBadge({
  rating,
  ratingCount,
  size = 'sm',
}: {
  rating: number;
  ratingCount?: number;
  size?: 'sm' | 'md';
}) {
  const sizes = {
    sm: { box: 'px-2 py-0.5 text-xs', star: 'w-3 h-3' },
    md: { box: 'px-2.5 py-1 text-sm', star: 'w-4 h-4' },
  };
  const s = sizes[size];

  return (
    <span className={`inline-flex items-center gap-1 bg-ink-900 rounded-full text-white font-bold ${s.box}`}>
      <Star className={`${s.star} text-brand-400 fill-brand-400`} />
      {rating.toFixed(1)}
      {ratingCount !== undefined && (
        <span className="font-medium text-ink-300">({ratingCount})</span>
      )}
    </span>
  );
}
