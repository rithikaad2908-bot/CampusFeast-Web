import { ChevronRight } from 'lucide-react';
import type { Category } from '@/types';

const iconMap: Record<string, string> = {
  Pizza: '🍕',
  Burger: '🍔',
  Sandwich: '🌯',
  Utensils: '🥞',
  RiceBowl: '🍚',
  CupSoda: '🥤',
};

interface CategoryPillProps {
  category: Category;
  active: boolean;
  onClick: () => void;
}

export function CategoryPill({ category, active, onClick }: CategoryPillProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold whitespace-nowrap transition-all active:scale-95 ${
        active
          ? 'bg-ink-900 text-white'
          : 'bg-white text-ink-600 border border-ink-200 hover:border-ink-400'
      }`}
    >
      <span className="text-base">{iconMap[category.icon] ?? '🍽'}</span>
      {category.name}
    </button>
  );
}

export function CategoryCard({ category, onClick }: { category: Category; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group flex flex-col items-center gap-2 shrink-0 w-20 active:scale-95 transition-transform"
    >
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-50 to-brand-100 flex items-center justify-center text-2xl group-hover:from-brand-100 group-hover:to-brand-200 transition-colors shadow-card">
        {iconMap[category.icon] ?? '🍽'}
      </div>
      <span className="text-xs font-bold text-ink-700 text-center leading-tight">
        {category.name}
      </span>
    </button>
  );
}

export function SectionHeader({
  title,
  subtitle,
  actionLabel,
  onAction,
}: {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="flex items-end justify-between mb-3">
      <div>
        <h2 className="text-lg md:text-xl font-extrabold text-ink-900">{title}</h2>
        {subtitle && <p className="text-sm text-ink-500 mt-0.5">{subtitle}</p>}
      </div>
      {actionLabel && (
        <button
          onClick={onAction}
          className="flex items-center gap-0.5 text-sm font-bold text-brand-600 hover:text-brand-700 transition-colors"
        >
          {actionLabel}
          <ChevronRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
