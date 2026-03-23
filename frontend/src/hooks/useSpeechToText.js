import { useState, useRef } from "react";

// Custom hook for speech-to-text functionality using the Web Speech API.
// Allows starting and stopping voice recognition, and handles the transcript.
const useSpeechToText = () => {
  // State to track if speech recognition is currently active
  const [isListening, setIsListening] = useState(false);
  // Reference to the speech recognition instance
  const recognitionRef = useRef(null);

  // Function to start listening for speech
  // Takes a callback function that receives the recognized text
  const startListening = (onResult) => {
    // Check if the browser supports Speech Recognition
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition not supported in this browser");
      return;
    }

    // Create a new recognition instance
    const recognition = new SpeechRecognition();
    // Set language to English (India)
    recognition.lang = "en-IN";
    // Stop after one utterance (not continuous)
    recognition.continuous = false;
    // Don't return interim results
    recognition.interimResults = false;

    // When recognition starts, update state
    recognition.onstart = () => {
      setIsListening(true);
    };

    // When recognition ends, update state
    recognition.onend = () => {
      setIsListening(false);
    };

    // When speech is recognized, call the callback with the transcript
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      onResult(transcript);
    };

    // Start recognition
    recognition.start();
    // Store reference for stopping later
    recognitionRef.current = recognition;
  };

  // Function to stop listening
  const stopListening = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
  };

  // Return the hook's interface
  return {
    isListening,
    startListening,
    stopListening
  };
};

export default useSpeechToText;