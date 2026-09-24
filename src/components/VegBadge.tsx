import { Leaf } from 'lucide-react';

export function VegBadge({ isVeg }: { isVeg: boolean }) {
  if (isVeg) {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-700 bg-green-50 rounded-full px-2 py-0.5">
        <Leaf className="w-3 h-3" />
        Veg
      </span>
    );
  }
  return (
    <span className="inline-flex items-center text-xs font-semibold text-ink-700 bg-ink-100 rounded-full px-2 py-0.5">
      Non-Veg
    </span>
  );
}
