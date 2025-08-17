import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

const VoiceHandler = ({ onCommand }) => {

  // const [person, setPerson] = useState("")
  // const [amount, setamount] = useState("")

  const processPayment = async (amount,person) => {
    const apiUrl = import.meta.env.VITE_BACKEND_URL

    try {
      // console.log('Sending payment request with:', { person, amount })
      
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
        console.log('Payment response:', response.data)
        onCommand(`Payment processed: ₹${amount} to ${person}`)
      }
    } catch (error) {
      console.log("Error processsing payment", error)
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

    recognition.onresult = (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript
        .trim()
        .toLowerCase();

      console.log("Heard:", transcript);

      if (transcript.includes("hello upi")) {
        onCommand("UPI activated.");
      } else if (transcript.startsWith("send")) {
        onCommand(`Transaction command detected: "${transcript}"`);
        const words = transcript.toLowerCase().split(' '); // Convert to lowercase for consistency
        const amountIndex = words.findIndex(word => word === 'send') + 1;
        const toIndex = words.findIndex(word => word === 'to') + 1;

        const extractedAmount = words[amountIndex];
        const extractedPerson = words[toIndex];

        // console.log(amount)
        // console.log(person)

        processPayment(extractedAmount,extractedPerson)

        
      } else {
        onCommand(`"${transcript}"`);
      }
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
    };

    recognition.start();

    return () => recognition.stop();
  }, [onCommand]);

  return null;
};

export default VoiceHandler;
