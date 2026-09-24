import { X } from 'lucide-react';
import { useEffect, type ReactNode } from 'react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
}

export function Modal({ open, onClose, children, title }: ModalProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center">
      <div
        className="absolute inset-0 bg-ink-950/50 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      <div className="relative w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-xl max-h-[85vh] overflow-y-auto animate-scale-in">
        {title && (
          <div className="sticky top-0 flex items-center justify-between px-5 py-4 bg-white border-b border-ink-100 z-10">
            <h2 className="font-bold text-lg text-ink-900">{title}</h2>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-ink-100 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-ink-500" />
            </button>
          </div>
        )}
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
