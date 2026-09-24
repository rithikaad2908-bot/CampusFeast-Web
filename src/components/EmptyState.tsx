import { Home as HomeIcon, Search } from 'lucide-react';
import { useApp } from '@/context';

interface EmptyStateProps {
  icon?: typeof HomeIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon: Icon = HomeIcon,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  const { navigate } = useApp();
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="w-20 h-20 rounded-full bg-ink-100 flex items-center justify-center mb-4">
        <Icon className="w-10 h-10 text-ink-300" strokeWidth={1.5} />
      </div>
      <h3 className="text-lg font-bold text-ink-800">{title}</h3>
      {description && (
        <p className="text-sm text-ink-500 mt-1.5 max-w-xs leading-relaxed">{description}</p>
      )}
      {actionLabel && (
        <button
          onClick={onAction ?? (() => navigate('menu'))}
          className="mt-5 flex items-center gap-2 bg-ink-900 text-white rounded-full px-5 py-2.5 text-sm font-bold hover:bg-ink-800 transition-colors active:scale-95"
        >
          <Search className="w-4 h-4" />
          {actionLabel}
        </button>
      )}
    </div>
  );
}
