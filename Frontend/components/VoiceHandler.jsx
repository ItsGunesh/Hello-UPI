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


  const CORRECT_PIN = "2308";
  const MAX_PIN_ATTEMPTS = 3;



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
    recognition.lang = "en-IN";

    recognition.onresult = async (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript
        .trim()
        .toLowerCase();

      console.log("Heard:", transcript);

      if (transcript.includes("hello upi")) {
        onCommand("UPI activated.");
      } else {
        onCommand(`Transaction command detected: "${transcript}"`);

        const prompt = `Convert this to english and return the sentence - ${transcript}`

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
          // console.log("inside gemini response")
          const translatedTextResponse = translatedText.data.candidates[0].content.parts[0].text

          const translatedString =JSON.stringify(translatedTextResponse).slice(1,-4)
          
          // console.log(translatedTextResponse)
          console.log(translatedString)
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





      }
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
    };

    recognition.start();

    return () => recognition.stop();
  }, [onCommand]);

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
