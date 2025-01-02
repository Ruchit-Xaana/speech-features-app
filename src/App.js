import React, { useState, useEffect } from 'react';
import { MicrophoneIcon, StopIcon } from '@heroicons/react/24/solid';

function App() {
  const [isListening, setIsListening] = useState(false);
  const [spokenText, setSpokenText] = useState('');
  const [textToSpeak, setTextToSpeak] = useState('');
  const [recognition, setRecognition] = useState(null);
  const [isInitializing, setIsInitializing] = useState(false);

  useEffect(() => {
    // Initializing speech recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('');

        setSpokenText(transcript);
      };

      recognition.onend = () => {
        setIsListening(false);
        setIsInitializing(false);
      };

      recognition.onaudiostart = () => {
        setIsInitializing(false);
        setIsListening(true);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsInitializing(false);
        setIsListening(false);
      };

      setRecognition(recognition);
    }
  }, []);

  const startListening = () => {
    if (recognition) {
      setSpokenText('');
      setIsInitializing(true);
      recognition.start();
    } else {
      alert('Speech recognition is not supported in this browser.');
    }
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
    }
  };

  const handleSpeak = () => {
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-center mb-8">Speech Features Demo</h1>

        {/* Speech to Text Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Speech to Text</h2>
          <div className="flex justify-center mb-4">
            {!isListening && !isInitializing ? (
              <button
                onClick={startListening}
                className="bg-blue-500 text-white px-4 py-2 rounded-full flex items-center"
              >
                <MicrophoneIcon className="h-5 w-5 mr-2" />
                Start Listening
              </button>
            ) : isInitializing ? (
              <div className="text-gray-600 flex items-center">
                <span className="text-gray-600">Initializing...</span>
              </div>
            ) : (
              <button
                onClick={stopListening}
                className="bg-red-500 text-white px-4 py-2 rounded-full flex items-center"
              >
                <StopIcon className="h-5 w-5 mr-2" />
                Stop Listening
              </button>
            )}
          </div>

          <div className="text-center text-sm mb-4">
            {isInitializing ? (
              <span className="text-gray-600">Please wait...</span>
            ) : isListening ? (
              <span className="text-green-600">Listening - Speak now!</span>
            ) : null}
          </div>
          <div className="border rounded p-4 min-h-[100px] bg-gray-50">
            {spokenText || 'Your spoken text will appear here...'}
          </div>
        </div>

        {/* Text to Speech Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Text to Speech</h2>
          <textarea
            className="w-full border rounded p-2 mb-4"
            rows="4"
            value={textToSpeak}
            onChange={(e) => setTextToSpeak(e.target.value)}
            placeholder="Enter text to be spoken..."
          />
          <button
            onClick={handleSpeak}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Speak Text
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;