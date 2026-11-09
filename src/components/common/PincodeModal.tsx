import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { X, MapPin, CheckCircle2 } from 'lucide-react';

interface PincodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PincodeModal: React.FC<PincodeModalProps> = ({ isOpen, onClose }) => {
  const { pincode, setPincode, showToast } = useStore();
  const [inputVal, setInputVal] = useState<string>(pincode);

  if (!isOpen) return null;

  const popularPincodes = [
    { pin: '400001', city: 'Mumbai Central' },
    { pin: '110001', city: 'New Delhi Connaught' },
    { pin: '560001', city: 'Bengaluru MG Road' },
    { pin: '600001', city: 'Chennai George Town' },
    { pin: '700001', city: 'Kolkata BBD Bagh' },
    { pin: '500001', city: 'Hyderabad Abids' },
  ];

  const handleApply = (pinToUse: string) => {
    if (pinToUse.length === 6) {
      setPincode(pinToUse);
      showToast(`Delivery location updated to ${pinToUse}`, 'success');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[9997] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2 text-blue-600">
            <MapPin className="w-5 h-5" />
            <h3 className="text-sm font-black text-gray-900">Change Delivery Location</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-gray-500">
          Enter your 6-digit delivery pincode to check stock availability and estimated delivery speed.
        </p>

        <div className="flex items-center gap-2">
          <input
            type="text"
            maxLength={6}
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value.replace(/\D/g, ''))}
            placeholder="Enter Pincode (e.g. 400001)"
            className="flex-1 text-xs font-bold p-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <button
            type="button"
            onClick={() => handleApply(inputVal)}
            disabled={inputVal.length !== 6}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl disabled:opacity-50 transition-colors shadow-sm"
          >
            Apply
          </button>
        </div>

        <div>
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block mb-2">
            Popular Metro Cities:
          </span>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {popularPincodes.map((item) => (
              <button
                key={item.pin}
                type="button"
                onClick={() => {
                  setInputVal(item.pin);
                  handleApply(item.pin);
                }}
                className={`p-2 rounded-lg text-left border transition-colors ${
                  pincode === item.pin
                    ? 'border-blue-600 bg-blue-50 text-blue-700 font-bold'
                    : 'border-gray-100 bg-gray-50 text-gray-700 hover:bg-blue-50/50'
                }`}
              >
                <div className="font-bold">{item.pin}</div>
                <div className="text-[10px] text-gray-500">{item.city}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
