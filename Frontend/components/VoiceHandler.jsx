import React, { useEffect } from "react";

const VoiceHandler = ({ onCommand }) => {
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
        onCommand("UPI activated. Please say 'Send X to Y'.");
      } else if (transcript.startsWith("send")) {
        onCommand(`Transaction command detected: "${transcript}"`);
        // Your input of (Backend integration / Razorpay API call) required
      } else {
        onCommand(`Heard: "${transcript}"`);
      }
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
    };

    recognition.start();

    return () => recognition.stop();
  }, [onCommand]);

  return null; // invisible, just runs in background
};

export default VoiceHandler;
