import { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader, NotFoundException } from "@zxing/library";
import axios from "axios";
import PinModal from "./PinModal";
import Footer from "./Footer/Footer";
import Navigator from "./Navigator/Navigator";
import TickAnimation from "./TickAnimation";

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
  const [completed, setCompleted] = useState(false)
  const [amount, setAmount] = useState()
  const [processMessage, setProcessMessage] = useState()

  const CORRECT_PIN = import.meta.env.VITE_CORRECT_PIN;
  const MAX_PIN_ATTEMPTS = import.meta.env.VITE_MAX_PIN_ATTEMPTS;



  const processPayment = async (amount, person) => {
    const apiUrl = import.meta.env.VITE_BACKEND_URL
    setIsProcessing(true);

    try {
      // console.log(apiUrl)
      setProcessMessage(`Making a payment of ${amount} to ${person}...`)

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
        setCompleted(true)
        setProcessMessage(`Payment of ${amount} to ${person} completed successfully`)
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
      setScannedText(true)
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
        .toLowerCase()
        .split(' ')[0];

      if (/\d/.test(transcript)) {
        setAmount(transcript);
        console.log("Amount recognized:", transcript);
        setShowPinModal(true)
        setScannedText(false)
        recognition.stop();
        setPendingPayment({ transcript, fullName })
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
            setScannedText("Please say the amount to be transfered");
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
    <>
      <div className="flex flex-col w-screen h-screen bg-gradient-to-br from-cyan-400 via-cyan-500 to-blue-500 justify-center items-center">
        <Navigator />
        <div className="flex flex-col h-screen justify-center items-center gap-4 ">
          {cameraActive && !scannedText && <video className="border-slate-900 border-10"
            ref={videoRef}
            style={{ width: "100%", maxWidth: "400px", borderRadius: "12px" }}
          />}

          {scannedText && (
            <div className="h-fit flex items-center justify-center">
              <span className="text-white bg-slate-900 font-mono break-words py-2 px-5 rounded">
                {/* {scannedText} */}
                {!amount && scannedText}

                {amount &&
                  <div className="flex flex-col items-center justify-center gap-5 p-5">
                    {completed && <TickAnimation/>}
                    {!completed && <div role="status">
                      <svg aria-hidden="true" class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                      </svg>
                      <span class="sr-only">Loading...</span>
                    </div>}
                    {processMessage}
                  </div>}

                {/* {fullName} */}
                {/* {upiId} */}
                {/* {amount} */}

              </span>
            </div>
          )}

          <PinModal
            visible={showPinModal}
            onVerify={handlePinVerify}
            onClose={handlePinClose}
            isProcessing={isProcessing}
            shouldClearPin={shouldClearPin}
            pinstatus={pinstatus}
            transCommand={`Making a pyament of ${amount} to ${fullName}`}
          />
          <div>
            <a className="px-4 py-2 bg-slate-900 text-white rounded-xl mt-4" href="/" >Back to Home</a>
          </div>
        </div>
        {/* <Footer /> */}
      </div>
    </>
  );
};

export default QRCodeScanner;
