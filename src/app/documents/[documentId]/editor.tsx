"use client";

import {
  forwardRef,
  useImperativeHandle,
  // useState,
} from "react";

import Table from '@tiptap/extension-table';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TableRow from '@tiptap/extension-table-row';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import { Color } from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import FontFamily from '@tiptap/extension-font-family';
import TextAlign from '@tiptap/extension-text-align';
import TextStyle from '@tiptap/extension-text-style';
import Underline from '@tiptap/extension-underline';
import ImageResize from 'tiptap-extension-resize-image';
import TaskItem from '@tiptap/extension-task-item';
import TaskList from '@tiptap/extension-task-list';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useLiveblocksExtension } from "@liveblocks/react-tiptap";
import { useStorage } from '@liveblocks/react';
import { useEditorStore } from '@/store/use-editor-store';
import { FontSizeExtension } from '@/extensions/font-size';
import { LineHeightExtension } from '@/extensions/line-height';
import { Threads } from './threads';

import { LEFT_MARGIN_DEFAULT, RIGHT_MARGIN_DEFAULT } from "@/constants/margins";
// import { useVoiceToText } from '@/hooks/usevoiceToText'; // Make sure this path is correct
// import { Button } from "@/components/ui/button"; // Use your button component or HTML buttons

interface EditorProps {
  initialContent?: string | undefined;
}

export interface EditorRef {
  insertAIContent: (text: string) => void;
}

export const Editor = forwardRef<EditorRef, EditorProps>(({ initialContent }, ref) => {
  const leftMargin = useStorage((root) => root.leftMargin) ?? LEFT_MARGIN_DEFAULT;
  const rightMargin = useStorage((root) => root.rightMargin) ?? RIGHT_MARGIN_DEFAULT;

  const liveblocks = useLiveblocksExtension({
    initialContent,
    offlineSupport_experimental: true,
  });

  const { setEditor } = useEditorStore();
  // const [interimText, setInterimText] = useState("");

  const editor = useEditor({
    autofocus: true,
    immediatelyRender: false,
    onCreate({ editor }) {
      setEditor(editor);
    },
    onDestroy() {
      setEditor(null);
    },
    onUpdate({ editor }) {
      setEditor(editor);
    },
    onSelectionUpdate({ editor }) {
      setEditor(editor);
    },
    onTransaction({ editor }) {
      setEditor(editor);
    },
    onFocus({ editor }) {
      setEditor(editor);
    },
    onBlur({ editor }) {
      setEditor(editor);
    },
    onContentError({ editor }) {
      setEditor(editor);
    },
    editorProps: {
      attributes: {
        style: `padding-left: ${leftMargin}px; padding-right: ${rightMargin}px;`,
        class:
          "focus:outline-none print:border-0 bg-white border border-[#C7C7C7] flex flex-col min-h-[1054px] w-[816px] pt-10 pr-14 pb-10 cursor-text",
      },
    },
    extensions: [
      liveblocks,
      StarterKit.configure({ history: false }),
      LineHeightExtension.configure({ types: ["heading", "paragraph"], defaultLineHeight: "normal" }),
      FontSizeExtension,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Link.configure({ openOnClick: false, autolink: true, defaultProtocol: "https" }),
      Color,
      Highlight.configure({ multicolor: true }),
      FontFamily,
      TextStyle,
      Underline,
      Image,
      ImageResize,
      Table,
      TableCell,
      TableHeader,
      TableRow,
      TaskItem.configure({ nested: true }),
      TaskList,
    ],
  });

  // const {
  //   listening,
  //   startListening,
  //   stopListening,
  // } = useVoiceToText(
  //   (finalText) => {
  //     editor?.commands.insertContent(finalText + ' ');
  //   },
  //   (interim) => {
  //     setInterimText(interim);
  //   }
  // );

  useImperativeHandle(ref, () => ({
    insertAIContent: (text: string) => {
      if (editor) {
        editor.commands.insertContent(text);
      }
    },
  }));

  return (
    <div className="size-full overflow-x-auto bg-[#F9FBFD] print:p-0 print:bg-white print:overflow-visible">
      <div className="min-w-max flex justify-center w-[816px] py-4 print:py-0 mx-auto print:w-full print:min-w-0 relative">
        <EditorContent editor={editor} />
        <Threads editor={editor} />
      </div>

      {/* Interim transcription feedback */}
      {/* {listening && interimText && (
        <div className="italic text-gray-600 px-4 mt-2">
          <span className="text-sm">🗣️ {interimText}</span>
        </div>
      )} */}

      {/* Controls */}
      {/* <div className="flex gap-2 px-4 mt-4">
        <Button onClick={startListening} disabled={listening}>
          🎙️ Start Voice
        </Button>
        <Button onClick={stopListening} disabled={!listening}>
          ⏹️ Stop
        </Button>
      </div> */}
    </div>
  );
});

Editor.displayName = "Editor";
