import { GraduationCap, UtensilsCrossed } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

export function Logo({ size = 'md', onClick }: LogoProps) {
  const sizes = {
    sm: { box: 'w-7 h-7', cap: 'w-3.5 h-3.5', fork: 'w-2.5 h-2.5', text: 'text-lg' },
    md: { box: 'w-9 h-9', cap: 'w-4.5 h-4.5', fork: 'w-3 h-3', text: 'text-2xl' },
    lg: { box: 'w-12 h-12', cap: 'w-6 h-6', fork: 'w-4 h-4', text: 'text-3xl' },
  };
  const s = sizes[size];

  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 font-extrabold tracking-tight select-none"
      aria-label="CampusFeast home"
    >
      <div className={`${s.box} rounded-xl bg-ink-900 flex items-center justify-center shrink-0 relative`}>
        <GraduationCap className="text-brand-400" strokeWidth={2.5} style={{ width: '55%', height: '55%' }} />
        <UtensilsCrossed
          className="absolute text-brand-400 opacity-90"
          strokeWidth={2.5}
          style={{ width: '38%', height: '38%', bottom: '1px', right: '1px' }}
        />
      </div>
      <span className={s.text}>
        <span className="text-ink-900">Campus</span>
        <span className="text-brand-500">Feast</span>
      </span>
    </button>
  );
}
