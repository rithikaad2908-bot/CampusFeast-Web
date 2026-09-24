import { useEffect, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';

interface ToastState {
  message: string;
  visible: boolean;
}

let showToastFn: ((message: string) => void) | null = null;

export function toast(message: string) {
  showToastFn?.(message);
}

export function ToastHost() {
  const [state, setState] = useState<ToastState>({ message: '', visible: false });

  useEffect(() => {
    showToastFn = (message: string) => {
      setState({ message, visible: true });
    };
    return () => {
      showToastFn = null;
    };
  }, []);

  useEffect(() => {
    if (!state.visible) return;
    const timer = setTimeout(() => {
      setState((prev) => ({ ...prev, visible: false }));
    }, 2200);
    return () => clearTimeout(timer);
  }, [state.visible]);

  return (
    <div
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-[70] transition-all duration-300 ${
        state.visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
      }`}
    >
      <div className="flex items-center gap-2 bg-ink-900 text-white rounded-full px-4 py-2.5 shadow-lg">
        <CheckCircle2 className="w-4 h-4 text-brand-400" />
        <span className="text-sm font-semibold">{state.message}</span>
      </div>
    </div>
  );
}
