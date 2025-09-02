import { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader, NotFoundException } from "@zxing/library";
import axios from "axios";

const QRCodeScanner = () => {
  const videoRef = useRef(null);
  const [scannedText, setScannedText] = useState("");
  const [cameraActive, setCameraActive] = useState(true);
  const [upiId, setUpiId] = useState("")
  const [fullName, setFullName] = useState("")
  const [contact, setContact] = useState()
  const [email, setEmail] = useState()

  const handleQR = async (Name,Email,Contact,vpaID) => {
    const apiUrl = import.meta.env.VITE_BACKEND_URL

    try {

      const response = await axios.post(`${apiUrl}/api/contact/createcontact`, { fullName:Name, email:Email, contact:Contact, type: "customer" }, {
        headers: {
          "Content-Type": "application/json"
        },
        withCredentials: true
      })

      // console.log(response)

      if (response.status === 200) {
        const contId = response.data.data.id

        console.log(contId)
        // console.log(response)
        console.log(vpaID)

        const QrFundAccResponse = await axios.post(`${apiUrl}/api/contact/fundacc`,{contId,vpaID},{
          headers: {
          "Content-Type": "application/json"
        },
        withCredentials: true
        })

        if(QrFundAccResponse.status===200){
          console.log("Account created Sucessfully")
        }
      }


    } catch (error) {
      console.log("Error in handleQR,", error)
    }

  }



  useEffect(() => {
    if (!cameraActive) return;

    const codeReader = new BrowserMultiFormatReader();

    function extractUPIDetails(url) {
      const queryString = url.split("?")[1];
      const params = new URLSearchParams(queryString);

      setFullName(decodeURIComponent(params.get("pn")).split(" ")[0]);
      const Name = decodeURIComponent(params.get("pn")).split(" ")[0]
      const vpaID = (params.get("pa"));
      setUpiId(vpaID)
      const exeText = params.get("pa").split("@")[0];

      if (exeText.length === 10 && !isNaN(exeText) && !isNaN(parseFloat(exeText))) {
        setContact(exeText)
        handleQR(Name,"",exeText,vpaID)
      }
      else {
        setEmail(exeText)
        handleQR(Name,exeText,"",vpaID)
      }



    }

    codeReader.decodeFromVideoDevice(
      null,
      videoRef.current,
      (result, err) => {
        if (result) {
          const text = result.getText();

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
          {fullName}
          {upiId}
        </p>
      )}
    </div>
  );
};

export default QRCodeScanner;
