import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import PinModal from "./PinModal";

const VoiceHandler = ({ onCommand }) => {

  const [showPinModal, setShowPinModal] = useState(false);
  const [pendingPayment, setPendingPayment] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pinAttempts, setPinAttempts] = useState(0);
  const [shouldClearPin, setShouldClearPin] = useState(false);
  const [pinstatus, setPinStatus] = useState('')
  const [UPIactivate, setUPIactivate] = useState(false)
  const [langCode, setLangCode] = useState("en-IN")

  // let langCode = "en-IN"
  let lang = "english"


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
        onCommand(`Payment processed: ₹${amount} to ${person}`)
      }
    } catch (error) {
      console.log("Error processsing payment", error)
      onCommand(`Payment failed: ${error.message}`)
    } finally {
      setIsProcessing(false);
    }
  }

  const handlePinVerify = (pin) => {
    if (pin === CORRECT_PIN) {
      setShowPinModal(false);
      setPinAttempts(0);
      onCommand("PIN verified. Processing payment...");
      setPinStatus("PIN verified.")
      if (pendingPayment) {
        processPayment(pendingPayment.amount, pendingPayment.person);
        setPendingPayment(null);
      }
    } else {
      const newAttempts = pinAttempts + 1;
      setPinAttempts(newAttempts);

      if (newAttempts >= MAX_PIN_ATTEMPTS) {
        setShowPinModal(false);
        setPinAttempts(0);
        setPendingPayment(null);
        onCommand("Too many failed PIN attempts. Payment cancelled.");
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
    onCommand("Payment cancelled.");
  };

  const initiatePayment = (amount, person) => {
    // if (!amount || !person) {
    //   onCommand("Invalid transaction details. Please try again.");
    //   return;
    // }
    if (showPinModal || isProcessing) {
      onCommand("Please complete the current transaction first.");
      return;
    }

    setPendingPayment({ amount, person });
    setPinAttempts(0);
    setShowPinModal(true);
    onCommand(`Please enter PIN to send ₹${amount} to ${person}`);
  };

  const handletranscript = async (sentence) => {

    try {

      const apiUrl = import.meta.env.VITE_BACKEND_URL

      const response = await axios.post(`${apiUrl}/api/pyserver/extract`, { sentence }, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      })

      if (response.status === 200) {
        return response.data
      }

    } catch (error) {
      console.log("Frontend handletranscript error :", error)
    }

  }

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.error("SpeechRecognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.lang = langCode;
    // console.log("LangCode:",langCode)

    recognition.onresult = async (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript
        .trim()
        .toLowerCase();

      console.log(transcript)

      // recognition.stop()
      if (UPIactivate) {
        listenForTransactionCommand(transcript, lang)
        setUPIactivate(false)
      }
      else if (transcript.includes("upi")) {

        console.log("Heard:", transcript);
        const firstWord = transcript.split(" ")[0]
        // console.log(firstWord)

        switch (firstWord.toLowerCase()) {
          case "namaste":
            // recognition.lang = "hi-IN";
            // langCode = "hi-IN"
            setLangCode("hi-IN")
            lang = "hindi"
            onCommand("UPI activate ho chuka hai");
            break;

          case "namaskar":
            // langCode = "mr-IN"
            setLangCode("mr-IN")
            lang = "marathi"
            onCommand("UPI suru zalay");
            break;

          case "nomoshkar":
            // langCode = "bn-IN"
            setLangCode("bn-IN")
            lang = "bengali"
            onCommand("UPI chalu hoye geche");
            break;

          case "namaste-gujarati":
            // langCode = "hi-IN"
            lang = "hindi"
            onCommand("UPI chalu thai gayu chhe");
            break;

          case "vanakkam":
            // langCode = "ta-IN"
            setLangCode("ta-IN")
            lang = "tamil"
            onCommand("UPI thodangiyullathu");
            break;

          case "namaskaram":
            // langCode = "te-IN"
            setLangCode("te-IN")
            lang = "telugu"
            onCommand("UPI modalaindhi");
            break;

          case "namaskara":
            // langCode = "kn-IN"
            setLangCode("kn-IN")
            lang = "kannada"
            onCommand("UPI shuru aagide");
            break;

          case "sat":
            // langCode = "pa-IN"
            setLangCode("pa-IN")
            lang = "punjabi"
            onCommand("UPI chalu ho chukka hai");
            break;

          default:
            onCommand("UPI has been activated");
            break;
        }

        recognition.lang = langCode


        // console.log(lang)
        setUPIactivate(true)
        // recognition.stop();

      }



    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
    };

    recognition.start();

    return () => recognition.stop();
  }, [onCommand]);

  const listenForTransactionCommand = async (text, lang) => {
    // const SpeechRecognition =
    //   window.SpeechRecognition || window.webkitSpeechRecognition;
    // const recognition2 = new SpeechRecognition();
    // recognition2.continuous = true;
    // recognition2.lang = langCode;

    // recognition2.onresult = async (event) => {
    //   const transCommand = event.results[event.results.length - 1][0].transcript
    //     .trim()
    //     .toLowerCase();

    console.log(text)

    // if(text.includes("upi")) return "UPI command"

    onCommand(`Transaction command detected: "${text}"`);

    const prompt = `You are a translation engine. 
Task: Translate the following sentence from ${lang} to English. 
Rules:
1. Preserve the meaning and correct word order of the original sentence.
2. Replace written numbers like 'two hundred', 'five hundred' with their numeric form (200, 500).
3. Do not output quotes, full stops, commas, or special characters.
4. Replace currency symbols with their English word (₹ -> rupees).
5. Output must always follow the structure: action + number (if any) + to + person/object.
6. Output only the translated sentence.

Sentence: ${text}`

    const geminiApi = import.meta.env.VITE_GEMINI_API_KEY


    const translatedText = await axios.post("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent", {
      contents: [
        {
          parts: [
            {
              text: prompt
            }
          ]
        }
      ]
    },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-goog-api-key': geminiApi
        },
      })


    if (translatedText.status === 200) {
      console.log("inside gemini response")
      const translatedTextResponse = translatedText.data.candidates[0].content.parts[0].text

      const translatedString = JSON.stringify(translatedTextResponse).slice(1, -3)

      console.log("translatedtextresponse", translatedTextResponse)
      console.log("translatedString", translatedString)
      // console.log(typeof(translatedString))
      const extractedtranscript = await handletranscript(translatedString)


      // JSON.stringify(extractedtranscript)

      const extractedAmount = extractedtranscript.data.Amount;
      const extractedPerson = extractedtranscript.data.Receiver;

      // console.log(extractedAmount)
      // console.log(extractedPerson)

      if (!extractedAmount || !extractedPerson) {
        onCommand(extractedtranscript.data)
      }
      else {
        initiatePayment(extractedAmount, extractedPerson)
      }
    }


    // console.log(extractedtranscript.data) .

    // console.log(typeof(extractedtranscript.data))

    // const words = transcript.toLowerCase().split(' ');
    // const amountIndex = words.findIndex(word => word === 'send') + 1;
    // const toIndex = words.findIndex(word => word === 'to') + 1;



    // console.log(extractedAmount)
    // console.log(extractedPerson)
    // };

    // recognition2.onerror = (event) => {
    //   console.error("Speech recognition error:", event.error);
    // };

    // recognition2.start();
  }

  // useEffect(()=>{

  //   const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  // if (!SpeechRecognition) {
  //   console.error("SpeechRecognition not supported in this browser.");
  //   return;
  // }
  // const recognition = new SpeechRecognition();
  // recognition.lang = langCode

  //   if(UPIactivate){
  //     recognition.start()
  //     recognition.onresult = async (event) => {
  //     const transCommand = event.results[event.results.length - 1][0].transcript
  //       .trim()
  //       .toLowerCase();

  //       onCommand(`Transaction command detected: "${transCommand}"`);

  //     const prompt = `Translate the following ${lang} sentence to English language. If you encounter any words like 'two hundred', 'five hundred', etc., replace them with their numeric values (e.g., 'two hundred' becomes 200, 'five hundred' becomes 500). Return only the translated sentence with no quotes no full stops. Sentence is this - ${transCommand}`

  //     const geminiApi = import.meta.env.VITE_GEMINI_API_KEY


  //     const translatedText = await axios.post("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent", {
  //       contents: [
  //         {
  //           parts: [
  //             {
  //               text: prompt
  //             }
  //           ]
  //         }
  //       ]
  //     },
  //       {
  //         headers: {
  //           'Content-Type': 'application/json',
  //           'X-goog-api-key': geminiApi
  //         },
  //       })


  //     if (translatedText.status === 200) {
  //       console.log("inside gemini response")
  //       const translatedTextResponse = translatedText.data.candidates[0].content.parts[0].text

  //       const translatedString = JSON.stringify(translatedTextResponse).slice(1, -3)

  //       console.log("translatedtextresponse",translatedTextResponse)
  //       console.log("translatedString",translatedString)
  //       console.log(typeof(translatedString))
  //       const extractedtranscript = await handletranscript(translatedString)


  //       // JSON.stringify(extractedtranscript)

  //       const extractedAmount = extractedtranscript.data.Amount;
  //       const extractedPerson = extractedtranscript.data.Receiver;

  //       // console.log(extractedAmount)
  //       // console.log(extractedPerson)

  //       if (!extractedAmount || !extractedPerson) {
  //         onCommand(extractedtranscript.data)
  //       }
  //       else {
  //         initiatePayment(extractedAmount, extractedPerson)
  //       }
  //     }


  //     // console.log(extractedtranscript.data) .

  //     // console.log(typeof(extractedtranscript.data))

  //     // const words = transcript.toLowerCase().split(' ');
  //     // const amountIndex = words.findIndex(word => word === 'send') + 1;
  //     // const toIndex = words.findIndex(word => word === 'to') + 1;



  //     // console.log(extractedAmount)
  //     // console.log(extractedPerson)
  //     }
  //   }
  // })

  return (
    <>
      <PinModal
        visible={showPinModal}
        onVerify={handlePinVerify}
        onClose={handlePinClose}
        isProcessing={isProcessing}
        shouldClearPin={shouldClearPin}
        pinstatus={pinstatus}
      />
    </>
  );
};

export default VoiceHandler;
