import { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader, NotFoundException } from "@zxing/library";
import axios from "axios";
import PinModal from "./PinModal";

const QRCodeScanner = () => {
  const videoRef = useRef(null);
  const [scannedText, setScannedText] = useState("");
  const [cameraActive, setCameraActive] = useState(true);
  const [upiId, setUpiId] = useState("")
  const [fullName, setFullName] = useState("")
  const [contact, setContact] = useState()
  const [email, setEmail] = useState()
  const [showPinModal, setShowPinModal] = useState(false);
  const [pendingPayment, setPendingPayment] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pinAttempts, setPinAttempts] = useState(0);
  const [shouldClearPin, setShouldClearPin] = useState(false);
  const [pinstatus, setPinStatus] = useState('')
  const [amountModal, setAmountModal] = useState(false)
  const [amount, setAmount] = useState()

  const CORRECT_PIN = import.meta.env.VITE_CORRECT_PIN;
  const MAX_PIN_ATTEMPTS = import.meta.env.VITE_MAX_PIN_ATTEMPTS;



  const processPayment = async (amount, person) => {
    const apiUrl = import.meta.env.VITE_BACKEND_URL
    setIsProcessing(true);

    try {
      // console.log(apiUrl)

      const requestData = {
        person: person,
        amount: amount
      }

      const response = await axios.post(`${apiUrl}/api/payment/processpayment`, requestData, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      })

      if (response.status === 200) {
        // console.log('Payment response:', response.data)
        // onCommand(`Payment processed: ₹${amount} to ${person}`)
      }
    } catch (error) {
      console.log("Error processsing payment", error)
      // onCommand(`Payment failed: ${error.message}`)
    } finally {
      setIsProcessing(false);
    }
  }

  const handlePinVerify = (pin) => {
    if (pin === CORRECT_PIN) {
      setShowPinModal(false);
      setPinAttempts(0);
      // onCommand("PIN verified. Processing payment...");
      setPinStatus("PIN verified.")
      if (pendingPayment) {
        processPayment(amount, fullName);
        setPendingPayment(null);
      }
    } else {
      const newAttempts = pinAttempts + 1;
      setPinAttempts(newAttempts);

      if (newAttempts >= MAX_PIN_ATTEMPTS) {
        setShowPinModal(false);
        setPinAttempts(0);
        setPendingPayment(null);
        // onCommand("Too many failed PIN attempts. Payment cancelled.");
      } else {
        // onCommand(`Incorrect PIN. ${MAX_PIN_ATTEMPTS - newAttempts} attempts remaining.`);
        setPinStatus("Incorrect PIN")
        setShouldClearPin(true);
        setTimeout(() => setShouldClearPin(false), 100);
      }
    }
  };

  const handlePinClose = () => {
    setShowPinModal(false);
    setPendingPayment(null);
    setPinAttempts(0);
    // onCommand("Payment cancelled.");
  };

  //initiate payment

  const checkVpaExist = async (Name, Email, Contact, vpaID) => {
    const apiUrl = import.meta.env.VITE_BACKEND_URL

    // console.log(vpaID)
    try {
      const response = await axios.post(`${apiUrl}/api/contact/exist`, { vpaID }, {
        headers: {
          "Content-Type": "application/json"
        },
        withCredentials: true
      })

      if (response.status === 200) {
        console.log(response)
        if (response.data.data === false) {
          handleQR(Name, Email, Contact, vpaID)
        }
        else {
          console.log("contact already exist")
        }

        amountVoiceHandler()

        // setShowPinModal(true)
      }

    } catch (error) {
      console.log("Error in vpaExists", error)
    }
  }

  const handleQR = async (Name, Email, Contact, vpaID) => {
    const apiUrl = import.meta.env.VITE_BACKEND_URL

    // console.log(Name,Email,Contact,vpaID)

    try {

      const response = await axios.post(`${apiUrl}/api/contact/createcontact`, { fullName: Name, email: Email, contact: Contact, type: "customer" }, {
        headers: {
          "Content-Type": "application/json"
        },
        withCredentials: true
      })

      // console.log("create contact response" , response)

      if (response.status === 200) {
        const contId = response.data.data.id

        console.log(contId)
        // console.log(response)
        console.log(vpaID)

        const QrFundAccResponse = await axios.post(`${apiUrl}/api/contact/fundacc`, { contId, vpaID }, {
          headers: {
            "Content-Type": "application/json"
          },
          withCredentials: true
        })

        // console.log("QRFA response" , QrFundAccResponse)

        if (QrFundAccResponse.status === 200) {
          console.log("Account created Sucessfully")
        }
      }


    } catch (error) {
      console.log("Error in handleQR,", error)
    }

  }

  const amountVoiceHandler = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.error("SpeechRecognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.lang = "en-IN";
    // console.log("LangCode:",langCode)

    recognition.onresult = async (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript
        .trim()
        .toLowerCase();

      if (/\d/.test(transcript)) {
        setAmount(transcript);
        console.log("Amount recognized:", transcript);
        setShowPinModal(true)
        recognition.stop();
        setPendingPayment({transcript,fullName})
      }

    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
    };

    recognition.start();

    return () => recognition.stop();
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
        checkVpaExist(Name, "", exeText, vpaID)
      }
      else {
        setEmail(exeText)
        checkVpaExist(Name, exeText, "", vpaID)
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
        <p className="text-white bg-slate-900 font-mono break-words p-2 rounded">
          {/* {scannedText} */}
          {!amount &&
            `Please say the amount to be transfered`}

          {amount && `Amount to be transferred is ${amount}`}

          {/* {fullName} */}
          {/* {upiId} */}
          {/* {amount} */}

        </p>
      )}

      <PinModal
        visible={showPinModal}
        onVerify={handlePinVerify}
        onClose={handlePinClose}
        isProcessing={isProcessing}
        shouldClearPin={shouldClearPin}
        pinstatus={pinstatus}
      />
    </div>
  );
};

export default QRCodeScanner;
