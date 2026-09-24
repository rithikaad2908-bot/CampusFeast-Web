import { useState } from 'react';
import { ArrowLeft, ArrowRight, Wallet, Smartphone, CreditCard, Store, Bike } from 'lucide-react';
import { useApp } from '@/context';
import { campusLocations } from '@/data';
import { EmptyState } from '@/components/EmptyState';
import type { FulfillmentType, PaymentMethod } from '@/types';
import { ShoppingBag } from 'lucide-react';

export function CheckoutPage() {
  const {
    cart,
    subtotal,
    discount,
    total,
    navigate,
    placeOrder,
    profile,
    selectedCampus,
    selectedBlock,
  } = useApp();

  const [form, setForm] = useState({
    studentName: profile.name,
    studentEmail: profile.email,
    phone: profile.phone,
    campus: selectedCampus,
    block: selectedBlock,
    fulfillment: 'pickup' as FulfillmentType,
    paymentMethod: 'upi' as PaymentMethod,
    instructions: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-5 pt-6">
        <h1 className="text-2xl font-extrabold text-ink-900 mb-4">Checkout</h1>
        <EmptyState
          icon={ShoppingBag}
          title="Nothing to checkout"
          description="Your cart is empty. Add some food first!"
          actionLabel="Browse Menu"
          onAction={() => navigate('menu')}
        />
      </div>
    );
  }

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.studentName.trim()) e.studentName = 'Name is required';
    if (!form.studentEmail.trim()) e.studentEmail = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.studentEmail))
      e.studentEmail = 'Enter a valid email';
    if (!form.phone.trim()) e.phone = 'Phone is required';
    else if (!/^[0-9+\-\s]{10,15}$/.test(form.phone)) e.phone = 'Enter a valid phone number';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const order = placeOrder({
      items: cart,
      subtotal,
      discount,
      total,
      studentName: form.studentName,
      studentEmail: form.studentEmail,
      phone: form.phone,
      campus: form.campus,
      block: form.block,
      fulfillment: form.fulfillment,
      paymentMethod: form.paymentMethod,
      instructions: form.instructions,
      estimatedTime: Math.max(...cart.map((c) => c.food.prepTime), 15),
    });

    // Navigate to confirmation
    navigate('confirmation', null);
    window.dispatchEvent(new CustomEvent('cf-order-placed', { detail: order.id }));
  };

  const set = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const currentCampus = campusLocations.find((l) => l.name === form.campus) ?? campusLocations[0];

  const inputClass = (field: string) =>
    `w-full bg-white border rounded-xl px-4 py-3 text-sm font-medium text-ink-800 placeholder:text-ink-400 focus:outline-none focus:ring-2 transition-all ${
      errors[field]
        ? 'border-red-400 focus:ring-red-300'
        : 'border-ink-200 focus:ring-brand-400 focus:border-transparent'
    }`;

  return (
    <div className="max-w-2xl mx-auto px-5 pt-6 pb-4">
      <button
        onClick={() => navigate('cart')}
        className="flex items-center gap-1.5 text-sm font-bold text-ink-600 hover:text-ink-900 transition-colors mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Cart
      </button>

      <h1 className="text-2xl font-extrabold text-ink-900 mb-4">Checkout</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Student details */}
        <div className="bg-white rounded-2xl p-4 shadow-card space-y-3">
          <h2 className="font-bold text-sm text-ink-900 uppercase tracking-wide">
            Student Details
          </h2>
          <div>
            <label className="text-xs font-bold text-ink-500 mb-1 block">Name</label>
            <input
              type="text"
              value={form.studentName}
              onChange={(e) => set('studentName', e.target.value)}
              placeholder="Your full name"
              className={inputClass('studentName')}
            />
            {errors.studentName && (
              <p className="text-xs text-red-500 mt-1">{errors.studentName}</p>
            )}
          </div>
          <div>
            <label className="text-xs font-bold text-ink-500 mb-1 block">Email</label>
            <input
              type="email"
              value={form.studentEmail}
              onChange={(e) => set('studentEmail', e.target.value)}
              placeholder="you@campus.edu"
              className={inputClass('studentEmail')}
            />
            {errors.studentEmail && (
              <p className="text-xs text-red-500 mt-1">{errors.studentEmail}</p>
            )}
          </div>
          <div>
            <label className="text-xs font-bold text-ink-500 mb-1 block">Phone Number</label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => set('phone', e.target.value)}
              placeholder="98765 43210"
              className={inputClass('phone')}
            />
            {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
          </div>
        </div>

        {/* Campus & block */}
        <div className="bg-white rounded-2xl p-4 shadow-card space-y-3">
          <h2 className="font-bold text-sm text-ink-900 uppercase tracking-wide">
            Pickup / Delivery Location
          </h2>
          <div>
            <label className="text-xs font-bold text-ink-500 mb-1 block">Campus</label>
            <select
              value={form.campus}
              onChange={(e) => {
                const newCampus = e.target.value;
                const loc = campusLocations.find((l) => l.name === newCampus);
                setForm((prev) => ({
                  ...prev,
                  campus: newCampus,
                  block: loc?.blocks[0] ?? prev.block,
                }));
              }}
              className={inputClass('campus')}
            >
              {campusLocations.map((loc) => (
                <option key={loc.id} value={loc.name}>
                  {loc.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-ink-500 mb-1 block">Block / Location</label>
            <select
              value={form.block}
              onChange={(e) => set('block', e.target.value)}
              className={inputClass('block')}
            >
              {currentCampus.blocks.map((block) => (
                <option key={block} value={block}>
                  {block}
                </option>
              ))}
            </select>
          </div>

          {/* Fulfillment */}
          <div>
            <label className="text-xs font-bold text-ink-500 mb-1.5 block">Delivery Option</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setForm((p) => ({ ...p, fulfillment: 'pickup' }))}
                className={`flex flex-col items-center gap-1.5 rounded-xl border p-3 transition-all ${
                  form.fulfillment === 'pickup'
                    ? 'border-brand-400 bg-brand-50'
                    : 'border-ink-200'
                }`}
              >
                <Store className={`w-5 h-5 ${form.fulfillment === 'pickup' ? 'text-brand-600' : 'text-ink-400'}`} />
                <span className="text-sm font-bold text-ink-800">Pickup</span>
                <span className="text-[10px] text-ink-500">Collect yourself</span>
              </button>
              <button
                type="button"
                onClick={() => setForm((p) => ({ ...p, fulfillment: 'delivery' }))}
                className={`flex flex-col items-center gap-1.5 rounded-xl border p-3 transition-all ${
                  form.fulfillment === 'delivery'
                    ? 'border-brand-400 bg-brand-50'
                    : 'border-ink-200'
                }`}
              >
                <Bike className={`w-5 h-5 ${form.fulfillment === 'delivery' ? 'text-brand-600' : 'text-ink-400'}`} />
                <span className="text-sm font-bold text-ink-800">Delivery</span>
                <span className="text-[10px] text-ink-500">To your block</span>
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-ink-500 mb-1 block">
              Special Instructions (optional)
            </label>
            <textarea
              value={form.instructions}
              onChange={(e) => set('instructions', e.target.value)}
              placeholder="e.g. Less spicy, extra chutney, call on arrival..."
              rows={2}
              className={inputClass('instructions') + ' resize-none'}
            />
          </div>
        </div>

        {/* Payment */}
        <div className="bg-white rounded-2xl p-4 shadow-card space-y-3">
          <h2 className="font-bold text-sm text-ink-900 uppercase tracking-wide">
            Payment Method
          </h2>
          <div className="space-y-2">
            {(
              [
                { value: 'upi', label: 'UPI', desc: 'Pay via any UPI app', icon: Smartphone },
                { value: 'cash', label: 'Cash at Pickup', desc: 'Pay when you collect', icon: Wallet },
                { value: 'card', label: 'Card', desc: 'Credit / Debit card', icon: CreditCard },
              ] as { value: PaymentMethod; label: string; desc: string; icon: typeof Wallet }[]
            ).map((method) => {
              const Icon = method.icon;
              return (
                <button
                  key={method.value}
                  type="button"
                  onClick={() => setForm((p) => ({ ...p, paymentMethod: method.value }))}
                  className={`flex items-center gap-3 w-full rounded-xl border p-3 transition-all ${
                    form.paymentMethod === method.value
                      ? 'border-brand-400 bg-brand-50'
                      : 'border-ink-200'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      form.paymentMethod === method.value ? 'bg-brand-400' : 'bg-ink-100'
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 ${
                        form.paymentMethod === method.value ? 'text-ink-900' : 'text-ink-500'
                      }`}
                    />
                  </div>
                  <div className="text-left flex-1">
                    <p className="text-sm font-bold text-ink-900">{method.label}</p>
                    <p className="text-xs text-ink-500">{method.desc}</p>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      form.paymentMethod === method.value
                        ? 'border-brand-500 bg-brand-400'
                        : 'border-ink-300'
                    }`}
                  >
                    {form.paymentMethod === method.value && (
                      <div className="w-2 h-2 rounded-full bg-ink-900" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
          <p className="text-xs text-ink-400 italic">
            Demo checkout — no real payment will be processed.
          </p>
        </div>

        {/* Order summary */}
        <div className="bg-ink-900 rounded-2xl p-4 text-white">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-ink-300">Subtotal</span>
            <span className="font-semibold">₹{subtotal}</span>
          </div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-brand-400">Student Discount</span>
            <span className="font-semibold text-brand-400">−₹{discount}</span>
          </div>
          <div className="flex justify-between text-base font-extrabold border-t border-ink-700 pt-2 mt-2">
            <span>Total Payable</span>
            <span>₹{total}</span>
          </div>
        </div>

        {/* Place order */}
        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 bg-brand-400 hover:bg-brand-500 text-ink-900 rounded-full py-4 font-bold transition-colors active:scale-95"
        >
          Place Order · ₹{total}
          <ArrowRight className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
}
