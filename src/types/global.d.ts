declare global {
  interface Window {
    webkitSpeechRecognition: unknown;
    SpeechRecognition: typeof window.webkitSpeechRecognition;
  }
}

// Declare SpeechRecognition type for TypeScript
