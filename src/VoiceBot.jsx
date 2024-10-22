import React, { memo, useState } from "react";

// Speech Recognition and Synthesis API support check
const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = SpeechRecognition ? new SpeechRecognition() : null;

navigator.permissions.query({ name: 'microphone' }).then((permissionStatus) => {
  console.log("Microphone permission state:", permissionStatus.state);
  if (permissionStatus.state === "denied") {
    alert("Microphone access is denied. Please enable it in your browser settings.");
  }
});

const VoiceBot = () => {
  const [transcript, setTranscript] = useState("");
  const [botResponse, setBotResponse] = useState("");
  const [isListening, setIsListening] = useState(false);

  // Function to handle Speech Recognition
  const startListening = () => {
    if (!recognition) {
      alert("Speech Recognition API not supported in this browser.");
      return;
    }

    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        console.log(stream)
        // Permission granted
        recognition.lang = "en-US"; // Set language
        recognition.interimResults = false; // Get only final results
        recognition.maxAlternatives = 1;
        recognition.continuous = true;
        recognition.start(); // Start listening
        setIsListening(true);

        recognition.onresult = (event) => {
          const speechResult = event.results[0][0].transcript;
          setTranscript(speechResult); // Set the transcribed text
          respondToUser(speechResult); // Generate a bot response
        };

        recognition.onend = () => {
          setIsListening(false); // Reset listening state when done
        };

        recognition.onerror = (event) => {
          console.error("Speech recognition error:", event.error);
          alert(`Speech recognition error: ${event.error}`);
          setIsListening(false);
        };

        recognition.onsoundstart = () => {
          console.log("Sound detected");
        };
    
        recognition.onsoundend = () => {
          console.log("No more sound detected");
        };
      })
      .catch(err => {
        console.error("Microphone access denied:", err);
        alert("Please allow microphone access to use this feature.");
      });

  };

  // Bot's logic to generate a simple response
  const respondToUser = (userSpeech) => {
    let response = "";

    // Simple bot logic to respond based on user input
    if (userSpeech.toLowerCase().includes("hello")) {
      response = "Hello! How can I help you today?";
    } else if (userSpeech.toLowerCase().includes("how are you")) {
      response = "I'm just a bot, but I'm doing great!";
    } else {
      response = "Sorry, I didn't understand that. Can you try again?";
    }

    setBotResponse(response); // Update the bot response state

    // Use Speech Synthesis to speak the bot's response
    const speech = new SpeechSynthesisUtterance(response);
    window.speechSynthesis.speak(speech); // Speak the bot's response
  };

  const stopListening = () => {
    if (recognition && isListening) {
      recognition.stop(); // Stop the Speech Recognition
      setIsListening(false); // Update listening state
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-5">
      <div className="mb-4">
        <div
          onClick={startListening}
          className="btn cursor-pointer text-white w-[300px] h-[40px] bg-gradient-to-tr from-blue-600 to-blue-400 rounded-md flex items-center justify-center transition-all duration-300 hover:from-blue-700 hover:to-blue-500"
        >
          {isListening ? "Listening..." : "Start Talking"}
        </div>
      </div>
      <div className="mb-4">
        <div
          onClick={stopListening}
          className="btn cursor-pointer text-white w-[300px] h-[40px] bg-gradient-to-tr from-red-600 to-red-400 rounded-md flex items-center justify-center transition-all duration-300 hover:from-red-700 hover:to-red-500"
        >
          Stop Talking
        </div>
      </div>

      <div className="w-full max-w-lg bg-white p-5 rounded-lg shadow-md">
        <p className="text-lg font-medium text-gray-800">
          <strong>Your speech:</strong> <span>{transcript}</span>
        </p>
        <p className="text-lg font-medium mt-4 text-blue-700">
          <strong>Bot's reply:</strong> <span>{botResponse}</span>
        </p>
      </div>
    </div>
  );
};

export default memo(VoiceBot);