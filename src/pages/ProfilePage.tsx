import { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Heart,
  Receipt,
  LogOut,
  Edit3,
  Check,
  X,
  Plus,
} from 'lucide-react';
import { useApp } from '@/context';
import { Modal } from '@/components/Modal';

export function ProfilePage() {
  const { profile, updateProfile, orders, favorites, navigate } = useApp();
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState(profile);
  const [locationOpen, setLocationOpen] = useState(false);

  const handleSave = () => {
    updateProfile(editForm);
    setEditing(false);
  };

  const startEdit = () => {
    setEditForm(profile);
    setEditing(true);
  };

  return (
    <div className="max-w-2xl mx-auto px-5 pt-6 pb-4">
      <h1 className="text-2xl font-extrabold text-ink-900 mb-5">Profile</h1>

      {/* Profile card */}
      <div className="bg-white rounded-2xl p-5 shadow-card mb-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-brand-300 to-brand-500 flex items-center justify-center text-2xl font-extrabold text-ink-900 shrink-0">
            {profile.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-extrabold text-ink-900 truncate">{profile.name}</h2>
            <p className="text-sm text-ink-500 truncate">{profile.email}</p>
            <p className="text-xs text-ink-400 mt-0.5">Student · Campus Member</p>
          </div>
          <button
            onClick={editing ? handleSave : startEdit}
            className="shrink-0 flex items-center gap-1.5 bg-ink-100 text-ink-700 rounded-full px-3 py-2 text-xs font-bold hover:bg-ink-200 transition-colors"
          >
            {editing ? (
              <>
                <Check className="w-3.5 h-3.5" />
                Save
              </>
            ) : (
              <>
                <Edit3 className="w-3.5 h-3.5" />
                Edit
              </>
            )}
          </button>
        </div>

        {/* Editable fields */}
        <div className="mt-4 space-y-3">
          <ProfileField
            icon={User}
            label="Name"
            value={editing ? editForm.name : profile.name}
            editable={editing}
            onChange={(v) => setEditForm((p) => ({ ...p, name: v }))}
          />
          <ProfileField
            icon={Mail}
            label="Email"
            value={editing ? editForm.email : profile.email}
            editable={editing}
            onChange={(v) => setEditForm((p) => ({ ...p, email: v }))}
          />
          <ProfileField
            icon={Phone}
            label="Phone"
            value={editing ? editForm.phone : profile.phone}
            editable={editing}
            onChange={(v) => setEditForm((p) => ({ ...p, phone: v }))}
          />
        </div>
      </div>

      {/* Saved locations */}
      <div className="bg-white rounded-2xl p-4 shadow-card mb-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-sm text-ink-900 uppercase tracking-wide">
            Saved Locations
          </h2>
          <button
            onClick={() => setLocationOpen(true)}
            className="flex items-center gap-1 text-xs font-bold text-brand-600"
          >
            <Plus className="w-3.5 h-3.5" />
            Add
          </button>
        </div>
        <div className="space-y-2">
          {profile.savedLocations.map((loc, i) => (
            <div key={i} className="flex items-center gap-2.5 text-sm text-ink-700">
              <div className="w-8 h-8 rounded-lg bg-brand-50 flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4 text-brand-600" />
              </div>
              <span className="font-semibold">{loc}</span>
            </div>
          ))}
          {profile.savedLocations.length === 0 && (
            <p className="text-sm text-ink-400">No saved locations yet.</p>
          )}
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <button
          onClick={() => navigate('orders')}
          className="bg-white rounded-2xl p-4 shadow-card text-left hover:shadow-card-hover transition-all active:scale-95"
        >
          <div className="flex items-center gap-2 mb-1">
            <Receipt className="w-5 h-5 text-brand-500" />
            <span className="text-2xl font-extrabold text-ink-900">{orders.length}</span>
          </div>
          <p className="text-xs text-ink-500 font-semibold">Previous Orders</p>
        </button>
        <button
          onClick={() => navigate('favorites')}
          className="bg-white rounded-2xl p-4 shadow-card text-left hover:shadow-card-hover transition-all active:scale-95"
        >
          <div className="flex items-center gap-2 mb-1">
            <Heart className="w-5 h-5 text-brand-500" />
            <span className="text-2xl font-extrabold text-ink-900">{favorites.length}</span>
          </div>
          <p className="text-xs text-ink-500 font-semibold">Favourites</p>
        </button>
      </div>

      {/* Quick links */}
      <div className="bg-white rounded-2xl shadow-card divide-y divide-ink-100 mb-4">
        <button
          onClick={() => navigate('orders')}
          className="flex items-center gap-3 w-full p-4 text-left hover:bg-ink-50 transition-colors"
        >
          <Receipt className="w-5 h-5 text-ink-400" />
          <span className="text-sm font-bold text-ink-800 flex-1">Order History</span>
          <span className="text-xs text-ink-400">{orders.length} orders</span>
        </button>
        <button
          onClick={() => navigate('favorites')}
          className="flex items-center gap-3 w-full p-4 text-left hover:bg-ink-50 transition-colors"
        >
          <Heart className="w-5 h-5 text-ink-400" />
          <span className="text-sm font-bold text-ink-800 flex-1">My Favourites</span>
          <span className="text-xs text-ink-400">{favorites.length} items</span>
        </button>
      </div>

      {/* Logout */}
      <button
        onClick={() => navigate('home')}
        className="flex items-center justify-center gap-2 w-full bg-white border border-red-200 text-red-500 rounded-2xl p-4 text-sm font-bold hover:bg-red-50 transition-colors active:scale-95"
      >
        <LogOut className="w-4 h-4" />
        Logout (Demo)
      </button>

      <p className="text-center text-xs text-ink-400 mt-4">
        CampusFeast · Demo Profile · No real authentication required
      </p>

      {/* Add location modal */}
      <AddLocationModal
        open={locationOpen}
        onClose={() => setLocationOpen(false)}
        onAdd={(loc) => {
          updateProfile({ savedLocations: [...profile.savedLocations, loc] });
          setLocationOpen(false);
        }}
      />
    </div>
  );
}

function ProfileField({
  icon: Icon,
  label,
  value,
  editable,
  onChange,
}: {
  icon: typeof User;
  label: string;
  value: string;
  editable: boolean;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 rounded-lg bg-ink-50 flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4 text-ink-400" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-bold text-ink-400 uppercase tracking-wide">{label}</p>
        {editable ? (
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full text-sm font-semibold text-ink-900 border-b border-brand-400 bg-transparent focus:outline-none -mb-0.5"
          />
        ) : (
          <p className="text-sm font-semibold text-ink-800 truncate">{value}</p>
        )}
      </div>
    </div>
  );
}

function AddLocationModal({
  open,
  onClose,
  onAdd,
}: {
  open: boolean;
  onClose: () => void;
  onAdd: (loc: string) => void;
}) {
  const [campus, setCampus] = useState('');
  const [block, setBlock] = useState('');

  return (
    <Modal open={open} onClose={onClose} title="Add Saved Location">
      <div className="space-y-4">
        <div>
          <label className="text-xs font-bold text-ink-500 mb-1 block">Campus</label>
          <input
            type="text"
            value={campus}
            onChange={(e) => setCampus(e.target.value)}
            placeholder="e.g. Main Canteen"
            className="w-full bg-white border border-ink-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-400"
          />
        </div>
        <div>
          <label className="text-xs font-bold text-ink-500 mb-1 block">Block / Location</label>
          <input
            type="text"
            value={block}
            onChange={(e) => setBlock(e.target.value)}
            placeholder="e.g. Ground Floor"
            className="w-full bg-white border border-ink-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-400"
          />
        </div>
        <button
          onClick={() => {
            if (campus.trim() && block.trim()) {
              onAdd(`${campus.trim()} — ${block.trim()}`);
              setCampus('');
              setBlock('');
            }
          }}
          className="w-full bg-ink-900 text-white rounded-xl py-3.5 font-bold transition-colors active:scale-95 disabled:opacity-50"
          disabled={!campus.trim() || !block.trim()}
        >
          Save Location
        </button>
      </div>
    </Modal>
  );
}
