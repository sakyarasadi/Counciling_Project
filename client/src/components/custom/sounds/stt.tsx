import React, { useState, useEffect } from 'react';
import './SpeechToText.css'; 

declare global {
  interface Window {
    webkitSpeechRecognition: any;
  }
}

interface SpeechToTextProps {
  onTranscript: (text: string) => void;
}

const SpeechToText: React.FC<SpeechToTextProps> = ({ onTranscript }) => {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  let recognition: any = null;

  useEffect(() => {
    if (isListening) {
      startRecognition();
    } else {
      stopRecognition();
    }

    return () => {
      stopRecognition();
    };
  }, [isListening]);

  useEffect(() => {
    onTranscript(transcript);
  }, [transcript]);

  const startRecognition = () => {
    recognition = new window.webkitSpeechRecognition();
    recognition.interimResults = true;
    recognition.lang = 'en-IN';
    recognition.continuous = true;
    recognition.onresult = (event: any) => {
      let text = '';
      for (let i = 0; i < event.results.length; i++) {
        text += event.results[i][0].transcript;
      }
      setTranscript(text);
    };
    recognition.start();
  };

  const stopRecognition = () => {
    if (recognition) {
      recognition.stop();
    }
  };

  const toggleRecognition = () => {
    setIsListening((prevIsListening) => !prevIsListening);
  };

  return (
    <div className="stt-container">
      <button className={isListening ? 'btn btn-danger stt-btn' : 'btn btn-primary stt-btn'} onClick={toggleRecognition}>
        {isListening ? 'Stop Listening' : 'Speak'}
      </button>
    </div>
  );
};

export default SpeechToText;
