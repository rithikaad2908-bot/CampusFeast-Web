import { useState } from 'react';
import { Star, Check } from 'lucide-react';

interface StarRatingProps {
  value: number;
  onChange?: (rating: number) => void;
  size?: 'sm' | 'md' | 'lg';
  readOnly?: boolean;
}

export function StarRating({ value, onChange, size = 'md', readOnly = false }: StarRatingProps) {
  const [hover, setHover] = useState(0);
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-10 h-10',
  };
  const starSize = sizes[size];

  return (
    <div className="flex items-center gap-1" role="radiogroup" aria-label="Star rating">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = readOnly ? star <= value : star <= (hover || value);
        return (
          <button
            key={star}
            type="button"
            disabled={readOnly}
            onClick={() => onChange?.(star)}
            onMouseEnter={() => !readOnly && setHover(star)}
            onMouseLeave={() => !readOnly && setHover(0)}
            className={`transition-transform ${!readOnly && 'active:scale-90 hover:scale-110'} ${readOnly && 'cursor-default'}`}
            aria-label={`${star} star${star !== 1 ? 's' : ''}`}
            role={readOnly ? undefined : 'radio'}
            aria-checked={readOnly ? undefined : star === value}
          >
            <Star
              className={`${starSize} transition-all ${
                filled
                  ? 'text-brand-400 fill-brand-400'
                  : 'text-ink-200 fill-ink-100'
              }`}
              strokeWidth={2}
            />
          </button>
        );
      })}
    </div>
  );
}

interface RateOrderProps {
  orderId: string;
  author: string;
  onSubmitted: () => void;
}

export function RateOrder({ orderId, author, onSubmitted }: RateOrderProps) {
  const { submitOrderRating, isOrderRated } = useAppSafe();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (isOrderRated(orderId)) {
    return (
      <div className="bg-green-50 rounded-2xl p-4 text-center">
        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-2">
          <Check className="w-5 h-5 text-green-600" />
        </div>
        <p className="text-sm font-bold text-green-700">Rated — thank you for your feedback!</p>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="bg-green-50 rounded-2xl p-5 text-center animate-scale-in">
        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
          <Check className="w-6 h-6 text-green-600" />
        </div>
        <p className="text-base font-extrabold text-green-700">Thank you for your feedback!</p>
        <p className="text-xs text-green-600 mt-1">Your rating has been saved and will appear on the food item's review page.</p>
      </div>
    );
  }

  const handleSubmit = () => {
    if (rating === 0) return;
    submitOrderRating(orderId, author, rating, comment);
    setSubmitted(true);
    setTimeout(onSubmitted, 100);
  };

  return (
    <div className="bg-white rounded-2xl p-5 shadow-card">
      <h3 className="text-base font-extrabold text-ink-900 text-center mb-1">
        How was your CampusFeast order?
      </h3>
      <p className="text-xs text-ink-500 text-center mb-4">
        Rate your meal and help others discover great food
      </p>

      <div className="flex justify-center mb-4">
        <StarRating value={rating} onChange={setRating} size="lg" />
      </div>

      {rating > 0 && (
        <p className="text-center text-sm font-bold text-brand-600 mb-3 animate-fade-in">
          {['', 'Needs improvement', 'Fair', 'Good', 'Very good', 'Excellent!'][rating]}
        </p>
      )}

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Write a review (optional)..."
        rows={3}
        className="w-full bg-ink-50 border border-ink-200 rounded-xl px-4 py-3 text-sm font-medium text-ink-800 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-brand-400 resize-none transition-all"
      />

      <button
        onClick={handleSubmit}
        disabled={rating === 0}
        className="w-full mt-3 bg-brand-400 hover:bg-brand-500 text-ink-900 rounded-full py-3.5 font-bold transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Submit Review
      </button>
    </div>
  );
}

// Separate import to avoid circular dependency issues
import { useApp } from '@/context';

function useAppSafe() {
  return useApp();
}
