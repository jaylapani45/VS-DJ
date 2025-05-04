"use client";

import { Preloaded, usePreloadedQuery } from "convex/react";
import { Editor, EditorRef } from "./editor";
import { Navbar } from "./navbar";
import { Room } from "./room";
import {Toolbar} from "./toolbar";
import { api } from "../../../../convex/_generated/api";
import { Ruler } from "./ruler";
import { useRef, useState } from "react";
import { AiPromptModal } from "./AiPromptModal";
import {marked} from "marked"

interface DocumentProps{
    preloadedDocument: Preloaded<typeof api.documents.getById>;
}

export const Document = ({ preloadedDocument }: DocumentProps) => {
    const document = usePreloadedQuery(preloadedDocument);
    const editorRef = useRef<EditorRef>(null);
    const [aiModalOpen, setAiModalOpen] = useState(false);
  
    const  handleAIResponse = async (response: string) => {
      const html = await Promise.resolve(marked.parse(response));
      editorRef.current?.insertAIContent(html);
    };
  
    return (
      <Room>
        <div className="min-h-screen bg-[#FAFBFD]">
          <div className="flex flex-col px-4 pt-2 gap-y-2 fixed top-0 left-0 right-0 z-10 bg-[#FAFBFD] print:hidden">
            <Navbar data={document} />
            <Toolbar onAskAI={() => setAiModalOpen(true)} document={document}/>
            <Ruler />
          </div>
  
          <div className="pt-[114px] print:pt-0">
            <Editor ref={editorRef} initialContent={document.initialContent} />
          </div>
        </div>
  
        <AiPromptModal
          isOpen={aiModalOpen}
          onClose={() => setAiModalOpen(false)}
          onSubmit={handleAIResponse}
        />
      </Room>
    );
  };