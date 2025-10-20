import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

const PinModal = ({
  visible,
  onVerify,
  onClose,
  isProcessing = false,
  shouldClearPin = false,
  pinstatus,
  transCommand
}) => {
  const [pin, setPin] = useState("");
  const [cameraActive, setCameraActive] = useState(false);
  const videoRef = useRef(null);
  const captureInterval = useRef(null);

  useEffect(() => {
    if (shouldClearPin) setPin("");
  }, [shouldClearPin]);

  const startCamera = async () => {
    if (cameraActive) return;
    setCameraActive(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) videoRef.current.srcObject = stream;

      captureInterval.current = setInterval(captureFrame, 3000);
    } catch (err) {
      console.error("Camera error:", err);
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    setCameraActive(false);
    clearInterval(captureInterval.current);
    const stream = videoRef.current?.srcObject;
    if (stream) stream.getTracks().forEach((track) => track.stop());
  };

  const captureFrame = async () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(async (blob) => {
      if (!blob) return;

      const formData = new FormData();
      formData.append("file", blob, "capture.jpg");

      try {
        const apiUrl = import.meta.env.VITE_BACKEND_URL;
        const response = await axios.post(
          `${apiUrl}/api/pyserver/recognise`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );


        console.log("Recognition result:", response);

        if (response.data.data.verified) {
          stopCamera();
          alert("Face verified successfully!");
          const correctPin = import.meta.env.VITE_CORRECT_PIN
          setPin(correctPin)
          // console.log("PIN",import.meta.env.VITE_CORRECT_PIN)
          handleSubmit(correctPin)
        }
      } catch (err) {
        console.error("Error sending frame:", err.response?.data || err.message);
      }
    }, "image/jpeg");
  };

  const handleDigit = (digit) => {
    if (pin.length < 4) setPin(pin + digit);
  };

  const handleClear = () => setPin("");

  const handleSubmit = (manualPin) => {
    onVerify(manualPin || pin);
    setPin("");
  };

  useEffect(() => {
    return () => stopCamera();
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xs bg-opacity-80 w-[64%] mt-[4%] mb-[5%]">
      <div className="bg-white rounded-lg shadow-lg p-6 w-72 flex flex-col items-center">
      <p className="font-bold text-center mb-10 border-3 p-2 border-slate-900 rounded-2xl">{transCommand}</p>
        <div
          className="border-2 py-2 px-4 rounded-4xl bg-slate-800 text-white cursor-pointer hover:bg-slate-700"
          onClick={startCamera}
        >
          <FontAwesomeIcon icon={faCamera} />
        </div>

        {cameraActive && (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-48 h-36 mt-3 rounded-lg border"
          />
        )}

        <h2 className="text-lg font-bold mb-2 mt-3">Enter PIN</h2>
        <input
          type="password"
          value={pin}
          readOnly
          className="border text-center text-xl mb-4 w-24 py-2"
          maxLength={4}
        />

        <div className="grid grid-cols-3 gap-2 mb-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
            <button
              key={n}
              className={`rounded p-2 text-lg ${isProcessing
                  ? "bg-gray-100 cursor-not-allowed opacity-50"
                  : "bg-gray-200 hover:bg-gray-300"
                }`}
              onClick={() => handleDigit(n.toString())}
              disabled={isProcessing}
            >
              {n}
            </button>
          ))}
          <button
            className={`rounded p-2 text-lg ${isProcessing
                ? "bg-gray-100 cursor-not-allowed opacity-50"
                : "bg-gray-200 hover:bg-gray-300"
              }`}
            onClick={handleClear}
            disabled={isProcessing}
          >
            C
          </button>
          <button
            className={`rounded p-2 text-lg ${isProcessing
                ? "bg-gray-100 cursor-not-allowed opacity-50"
                : "bg-gray-200 hover:bg-gray-300"
              }`}
            onClick={() => handleDigit("0")}
            disabled={isProcessing}
          >
            0
          </button>
          <button
            className={`rounded p-2 text-lg ${isProcessing
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600 text-white"
              }`}
            onClick={handleSubmit}
            disabled={isProcessing}
          >
            {isProcessing ? "Processing..." : "OK"}
          </button>
        </div>

        <button
          className={`text-xs text-gray-500 mt-2 ${isProcessing ? "cursor-not-allowed opacity-50" : "hover:text-gray-700"
            }`}
          onClick={() => {
            stopCamera();
            onClose();
          }}
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
