import { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader, NotFoundException } from "@zxing/library";

const QRCodeScanner = () => {
  const videoRef = useRef(null);
  const [scannedText, setScannedText] = useState("");
  const [cameraActive, setCameraActive] = useState(true);
  const [upiId, setUpiId] = useState()
  const [name, setName] = useState()

  useEffect(() => {
    if (!cameraActive) return;

    const codeReader = new BrowserMultiFormatReader();

    function extractUPIDetails(url) {
      const queryString = url.split("?")[1];
      const params = new URLSearchParams(queryString);

      setUpiId(params.get("pa"));
      setName(decodeURIComponent(params.get("pn")));
      ;
    }

    codeReader.decodeFromVideoDevice(
      null,
      videoRef.current,
      (result, err) => {
        if (result) {
          const text = result.getText();

          // ✅ Check if it starts with "upi://"
          if (text.startsWith("upi://")) {
            setScannedText(text);
            extractUPIDetails(text);
            console.log("✅ QR Code:", text);

            codeReader.reset();
            setCameraActive(false);
          } else {
            console.error("❌ Invalid QR: Not a UPI QR");
            setScannedText("❌ Invalid QR: Not a UPI QR")
            codeReader.reset();
            setCameraActive(false);
          }
        }

        if (err && !(err instanceof NotFoundException)) {
          console.error("Error:", err);
        }
      }
    );


    return () => {
      codeReader.reset();
    };
  }, [cameraActive]);

  return (
    <div className="flex flex-col items-center gap-4">
      {cameraActive && <video
          ref={videoRef}
          style={{ width: "100%", maxWidth: "400px", borderRadius: "12px" }}
        />}

      {scannedText && (
        <p className="text-green-600 font-mono break-words p-2 border rounded">
          {/* {scannedText} */}
          {name}
          {upiId}
        </p>
      )}
    </div>
  );
};

export default QRCodeScanner;
