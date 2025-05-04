"use client";
import React, { useEffect, useRef, useState } from "react";
import { MicIcon, MicOffIcon } from "lucide-react";
import { useEditorStore } from "@/store/use-editor-store";
import { Button } from "@/components/ui/button";

// TypeScript declaration merging to extend the Window interface
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    webkitSpeechRecognition: any;
    SpeechRecognition: typeof window.webkitSpeechRecognition;
  }
}

// Declare SpeechRecognition globally for TypeScript
type SpeechRecognition = {
  start: () => void;
  stop: () => void;
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: CustomSpeechRecognitionEvent) => void) | null;
  onend: (() => void) | null;
};

interface CustomSpeechRecognitionEvent extends Event {
  readonly results: SpeechRecognitionResultList;
  readonly resultIndex: number;
}

const VoiceButton: React.FC = () => {
  const { editor } = useEditorStore();
  const [isListening, setIsListening] = useState(false);
  const [interimText, setInterimText] = useState("");
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const promptRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognitionConstructor =
        window.SpeechRecognition || window.webkitSpeechRecognition;

      if (SpeechRecognitionConstructor) {
        const recog = new SpeechRecognitionConstructor();
        recog.continuous = true;
        recog.interimResults = true;
        recog.lang = "en-US";

        recog.onresult = (event: CustomSpeechRecognitionEvent) => {
          let transcript = "";
          for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
            if (!event.results[i].isFinal) {
              setInterimText(transcript);
            } else {
              editor?.commands.insertContent(transcript);
              setInterimText("");
            }
          }
        };

        recog.onend = () => {
          setIsListening(false);
        };

        setRecognition(recog);
      }
    }
  }, [editor]);

  const startListening = () => {
    recognition?.start();
    setIsListening(true);
  };

  const stopListening = () => {
    recognition?.stop();
    setIsListening(false);
  };

  return (
    <>
      {/* Mic Button (can be fixed or floating too) */}
      {!isListening && (
        <Button
        onClick={startListening}
        className="h-8 w-8 m-1 p-2 rounded-full bg-white shadow transition-all duration-300 hover:bg-gradient-to-r hover:from-orange-500 hover:to-red-500 group"
      >
        <MicIcon className="w-5 h-5 text-black group-hover:text-white transition-colors duration-200" />
      </Button>
      )}

      {/* Bottom-left Prompt Box */}
      {isListening && (
        <div
          ref={promptRef}
          className="fixed bottom-6 left-6 z-50 min-w-[220px] max-w-[400px] p-4 bg-white shadow-2xl rounded-xl border border-neutral-300 animate-in fade-in"
        >
          <div className="text-sm text-black max-h-60 overflow-auto whitespace-pre-wrap break-words">
            {interimText || "Listening..."}
          </div>

          <Button
            onClick={stopListening}
            variant="destructive"
            className="mt-4 w-full h-8 text-xs"
          >
            <MicOffIcon className="w-4 h-4 mr-1" />
            Stop
          </Button>
        </div>
      )}
    </>
  );
};

export default VoiceButton;

