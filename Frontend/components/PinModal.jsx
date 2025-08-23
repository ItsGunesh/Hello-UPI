import React, { useState } from 'react';

const PinModal = ({ visible, onVerify, onClose, isProcessing = false, shouldClearPin = false , pinstatus }) => {
  const [pin, setPin] = useState('');

  React.useEffect(() => {
    if (shouldClearPin) {
      setPin('');
    }
  }, [shouldClearPin]);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xs bg-opacity-80 w-[64%] mt-[4%] mb-[5%]">
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
              className={`rounded p-2 text-lg ${isProcessing ? 'bg-gray-100 cursor-not-allowed opacity-50' : 'bg-gray-200 hover:bg-gray-300'}`}
              onClick={() => handleDigit(n.toString())}
              disabled={isProcessing}
            >
              {n}
            </button>
          ))}
          <button 
            className={`rounded p-2 text-lg ${isProcessing ? 'bg-gray-100 cursor-not-allowed opacity-50' : 'bg-gray-200 hover:bg-gray-300'}`} 
            onClick={handleClear}
            disabled={isProcessing}
          >
            C
          </button>
          <button 
            className={`rounded p-2 text-lg ${isProcessing ? 'bg-gray-100 cursor-not-allowed opacity-50' : 'bg-gray-200 hover:bg-gray-300'}`} 
            onClick={() => handleDigit('0')}
            disabled={isProcessing}
          >
            0
          </button>
          <button 
          className={`rounded p-2 text-lg ${isProcessing ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`} 
          onClick={handleSubmit}
          disabled={isProcessing}
        >
          {isProcessing ? 'Processing...' : 'OK'}
        </button>
        </div>
        <button 
          className={`text-xs text-gray-500 mt-2 ${isProcessing ? 'cursor-not-allowed opacity-50' : 'hover:text-gray-700'}`} 
          onClick={onClose}
          disabled={isProcessing}
        >
          Cancel
        </button>
        <p className="text-red-600">{pinstatus}</p>
      </div>
    </div>
  );
};

export default PinModal;