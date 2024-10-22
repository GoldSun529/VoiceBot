import React from "react";
import * as Sentry from "@sentry/react";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import Slider from "./Slider";
import axios from "axios";
import VoiceBot from "./VoiceBot";
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = SpeechRecognition ? new SpeechRecognition() : null;

const App = () => {
  const sendingRequest = () => {
    axios.post("http://localhost:3000/talk", { input: " here's my voice " });
  };

  const startTalking = () => {
    recognition.start();
  }

  return (
    <main className="bg-[#121212]/80 h-screen w-screen flex-center">
      {/* <Slider /> */}
      <div className="sample-request-app w-screen h-screen bg-slate-400 flex-center">
        <VoiceBot/>
      </div>
    </main>
  );
};

export default App;
