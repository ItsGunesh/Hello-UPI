import { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader, NotFoundException } from "@zxing/library";

const QRCodeScanner = () => {
  const videoRef = useRef(null);
  const [scannedText, setScannedText] = useState("");
  const [cameraActive, setCameraActive] = useState(true);

  useEffect(() => {
    if (!cameraActive) return;

    const codeReader = new BrowserMultiFormatReader();

    codeReader.decodeFromVideoDevice(
      null,
      videoRef.current,
      (result, err) => {
        if (result) {
          const text = result.getText();
          setScannedText(text);
          console.log("✅ QR Code:", text);

          codeReader.reset();
          setCameraActive(false);
        }
        if (err && !(err instanceof NotFoundException)) {
          console.error("❌ Error:", err);
        }
      }
    );

    return () => {
      codeReader.reset();
    };
  }, [cameraActive]);

  return (
    <div className="flex flex-col items-center gap-4">
      {cameraActive ? (
        <video
          ref={videoRef}
          style={{ width: "100%", maxWidth: "400px", borderRadius: "12px" }}
        />
      ) : (
        <p className="text-blue-600">📷 Camera stopped after scanning</p>
      )}

      {scannedText && (
        <p className="text-green-600 font-mono break-words p-2 border rounded">
          {scannedText}
        </p>
      )}
    </div>
  );
};

export default QRCodeScanner;
