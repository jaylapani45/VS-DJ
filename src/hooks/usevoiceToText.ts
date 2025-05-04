import { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    webkitSpeechRecognition: any;
    SpeechRecognition: typeof window.webkitSpeechRecognition;
  }
}

type SpeechRecognition = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onend: (() => void) | null;
  onerror: ((event: SpeechRecognitionEvent) => void) | null;
};

type SpeechRecognitionEvent = {
  error(arg0: string, error: Error): unknown;
  resultIndex: number;
  results: {
    isFinal: boolean;
    [key: number]: {
      transcript: string;
    };
  }[];
};

type UseVoiceToTextHook = {
  listening: boolean;
  startListening: () => void;
  stopListening: () => void;
};

export const useVoiceToText = (
  onFinal: (text: string) => void,
  onInterim?: (text: string) => void
): UseVoiceToTextHook => {
  const [listening, setListening] = useState<boolean>(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn('Speech Recognition API not supported in this browser.');
      return;
    }

    const recognition: SpeechRecognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const result = event.results[i];
        const transcript = result[0].transcript;
        if (result.isFinal) {
          finalTranscript += transcript + ' ';
        } else {
          interimTranscript += transcript + ' ';
        }
      }

      if (finalTranscript && onFinal) {
        onFinal(finalTranscript.trim());
      }

      if (interimTranscript && onInterim) {
        onInterim(interimTranscript.trim());
      }
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.onerror = (event: SpeechRecognitionEvent) => {
      console.error('Speech recognition error:', event.error);
      setListening(false);
    };

    recognitionRef.current = recognition;

    // Optional: cleanup on unmount
    return () => {
      recognition.stop();
    };
  }, [onFinal, onInterim]);

  const startListening = () => {
    if (recognitionRef.current && !listening) {
      try {
        recognitionRef.current.start();
        setListening(true);
      } catch (error) {
        console.error('Failed to start recognition:', error);
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && listening) {
      recognitionRef.current.stop();
      setListening(false);
    }
  };

  return {
    listening,
    startListening,
    stopListening,
  };
};

