import { useState } from 'react';
import { MapPin, ChevronDown, Check } from 'lucide-react';
import { useApp } from '@/context';
import { campusLocations } from '@/data';
import { Modal } from './Modal';

export function CampusSelector({ compact = false }: { compact?: boolean }) {
  const { selectedCampus, selectedBlock, setSelectedCampus, setSelectedBlock } = useApp();
  const [open, setOpen] = useState(false);
  const [tempCampus, setTempCampus] = useState(selectedCampus);
  const [tempBlock, setTempBlock] = useState(selectedBlock);

  const handleConfirm = () => {
    setSelectedCampus(tempCampus);
    setSelectedBlock(tempBlock);
    setOpen(false);
  };

  if (compact) {
    return (
      <>
        <button
          onClick={() => {
            setTempCampus(selectedCampus);
            setTempBlock(selectedBlock);
            setOpen(true);
          }}
          className="flex items-center gap-1.5 text-sm font-semibold text-ink-700 hover:text-ink-900 transition-colors"
        >
          <MapPin className="w-4 h-4 text-brand-500" />
          <span className="max-w-[140px] truncate">
            {selectedCampus} — {selectedBlock}
          </span>
          <ChevronDown className="w-3.5 h-3.5 text-ink-400" />
        </button>
        <CampusModal
          open={open}
          onClose={() => setOpen(false)}
          tempCampus={tempCampus}
          tempBlock={tempBlock}
          setTempCampus={setTempCampus}
          setTempBlock={setTempBlock}
          onConfirm={handleConfirm}
        />
      </>
    );
  }

  return (
    <>
      <button
        onClick={() => {
          setTempCampus(selectedCampus);
          setTempBlock(selectedBlock);
          setOpen(true);
        }}
        className="w-full flex items-center gap-3 bg-white border border-ink-200 rounded-2xl p-4 text-left hover:border-ink-300 transition-colors"
      >
        <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center shrink-0">
          <MapPin className="w-5 h-5 text-brand-600" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-ink-500 font-medium">Delivering to</p>
          <p className="text-sm font-bold text-ink-900 truncate">
            {selectedCampus} — {selectedBlock}
          </p>
        </div>
        <ChevronDown className="w-5 h-5 text-ink-400 shrink-0" />
      </button>
      <CampusModal
        open={open}
        onClose={() => setOpen(false)}
        tempCampus={tempCampus}
        tempBlock={tempBlock}
        setTempCampus={setTempCampus}
        setTempBlock={setTempBlock}
        onConfirm={handleConfirm}
      />
    </>
  );
}

function CampusModal({
  open,
  onClose,
  tempCampus,
  tempBlock,
  setTempCampus,
  setTempBlock,
  onConfirm,
}: {
  open: boolean;
  onClose: () => void;
  tempCampus: string;
  tempBlock: string;
  setTempCampus: (v: string) => void;
  setTempBlock: (v: string) => void;
  onConfirm: () => void;
}) {
  const currentLocation = campusLocations.find((l) => l.name === tempCampus) ?? campusLocations[0];

  return (
    <Modal open={open} onClose={onClose} title="Select Campus Location">
      <div className="space-y-5">
        <div>
          <label className="text-sm font-bold text-ink-700 mb-2 block">Campus</label>
          <div className="grid grid-cols-2 gap-2">
            {campusLocations.map((loc) => (
              <button
                key={loc.id}
                onClick={() => {
                  setTempCampus(loc.name);
                  setTempBlock(loc.blocks[0]);
                }}
                className={`flex items-center gap-2 rounded-xl border p-3 text-left text-sm font-semibold transition-all ${
                  tempCampus === loc.name
                    ? 'border-brand-400 bg-brand-50 text-ink-900'
                    : 'border-ink-200 text-ink-600 hover:border-ink-300'
                }`}
              >
                <MapPin className="w-4 h-4 shrink-0 text-brand-500" />
                <span className="truncate">{loc.name}</span>
                {tempCampus === loc.name && (
                  <Check className="w-4 h-4 text-brand-600 ml-auto shrink-0" />
                )}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-bold text-ink-700 mb-2 block">Block / Location</label>
          <div className="flex flex-wrap gap-2">
            {currentLocation.blocks.map((block) => (
              <button
                key={block}
                onClick={() => setTempBlock(block)}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition-all ${
                  tempBlock === block
                    ? 'border-ink-900 bg-ink-900 text-white'
                    : 'border-ink-200 text-ink-600 hover:border-ink-300'
                }`}
              >
                {block}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={onConfirm}
          className="w-full bg-brand-400 hover:bg-brand-500 text-ink-900 rounded-xl py-3.5 font-bold transition-colors active:scale-95"
        >
          Confirm Location
        </button>
      </div>
    </Modal>
  );
}
