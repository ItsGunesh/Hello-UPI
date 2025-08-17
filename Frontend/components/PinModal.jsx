import React, { useState } from 'react';

const PinModal = ({ visible, onVerify, onClose }) => {
  const [pin, setPin] = useState('');

  const handleDigit = (digit) => {
    if (pin.length < 4) setPin(pin + digit);
  };

  const handleClear = () => setPin('');

  const handleSubmit = () => {
    onVerify(pin);
    setPin('');
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-lg p-6 w-72 flex flex-col items-center">
        <h2 className="text-lg font-bold mb-2">Enter PIN</h2>
        <input
          type="password"
          value={pin}
          readOnly
          className="border text-center text-xl mb-4 w-24 py-2"
          maxLength={4}
        />
        <div className="grid grid-cols-3 gap-2 mb-4">
          {[1,2,3,4,5,6,7,8,9].map(n => (
            <button
              key={n}
              className="bg-gray-200 rounded p-2 text-lg"
              onClick={() => handleDigit(n.toString())}
            >
              {n}
            </button>
          ))}
          <button className="bg-gray-200 rounded p-2 text-lg" onClick={handleClear}>C</button>
          <button className="bg-gray-200 rounded p-2 text-lg" onClick={() => handleDigit('0')}>0</button>
          <button className="bg-blue-500 text-white rounded p-2 text-lg" onClick={handleSubmit}>OK</button>
        </div>
        <button className="text-xs text-gray-500 mt-2" onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default PinModal;