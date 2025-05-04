// "use client";

// import React, { useRef, useEffect, useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Card, CardContent } from "@/components/ui/card";
// import { Check, Trash2, X, Loader2 } from "lucide-react";
// import { cn } from "@/lib/utils";
// import { useQuery, useMutation } from "convex/react";
// import { api } from "../../../../convex/_generated/api";
// import { Id } from "../../../../convex/_generated/dataModel";
// import { toast } from "sonner";

// const NOTE_COLORS = [
//   "bg-yellow-100",
//   "bg-green-100",
//   "bg-pink-100",
//   "bg-blue-100",
//   "bg-purple-100",
//   "bg-orange-100",
// ];

// interface NotesBoardProps {
//   isOpen: boolean;
//   onClose: () => void;
// }

// const NotesBoard: React.FC<NotesBoardProps> = ({ isOpen, onClose }) => {
//   const boardRef = useRef<HTMLDivElement>(null);
//   const notes = useQuery(api.notes.get);
//   const createNote = useMutation(api.notes.create);
//   const updateNote = useMutation(api.notes.update);
//   const deleteNote = useMutation(api.notes.remove);
  
//   const [newHeading, setNewHeading] = useState("");
//   const [newContent, setNewContent] = useState("");
//   const [editingNoteId, setEditingNoteId] = useState<Id<"notes"> | null>(null);
//   const [editedHeading, setEditedHeading] = useState("");
//   const [editedContent, setEditedContent] = useState("");
//   const [isCreating, setIsCreating] = useState(false);
//   const [isUpdating, setIsUpdating] = useState(false);
//   const editingTextareaRef = useRef<HTMLTextAreaElement>(null);

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (boardRef.current && !boardRef.current.contains(event.target as Node)) {
//         onClose();
//       }
//     };

//     if (isOpen) {
//       document.addEventListener("mousedown", handleClickOutside);
//     }

//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [isOpen, onClose]);

//   const handleAddNote = () => {
//     if (!newContent.trim()) {
//       toast.error("Note content cannot be empty");
//       return;
//     }

//     setIsCreating(true);
//     createNote({
//       heading: newHeading.trim(),
//       content: newContent.trim(),
//       color: NOTE_COLORS[Math.floor(Math.random() * NOTE_COLORS.length)],
//     })
//       .then(() => {
//         setNewHeading("");
//         setNewContent("");
//         toast.success("Note created");
//       })
//       .catch(() => toast.error("Failed to create note"))
//       .finally(() => setIsCreating(false));
//   };

//   const handleDeleteNote = (id: Id<"notes">) => {
//     deleteNote({ id })
//       .then(() => toast.success("Note deleted"))
//       .catch(() => toast.error("Failed to delete note"));
//   };

//   const saveEditedNote = () => {
//     if (!editingNoteId || !editedContent.trim()) {
//       toast.error("Note content cannot be empty");
//       return;
//     }

//     setIsUpdating(true);
//     updateNote({
//       id: editingNoteId,
//       heading: editedHeading.trim(),
//       content: editedContent.trim(),
//     })
//       .then(() => {
//         setEditingNoteId(null);
//         toast.success("Note updated");
//       })
//       .catch(() => toast.error("Failed to update note"))
//       .finally(() => setIsUpdating(false));
//   };

//   const autoGrow = (el: HTMLTextAreaElement) => {
//     el.style.height = "auto";
//     el.style.height = `${el.scrollHeight}px`;
//   };

//   if (notes === undefined) {
//     return (
//       <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
//         <Loader2 className="h-8 w-8 animate-spin text-white" />
//       </div>
//     );
//   }

//   return (
//     <div
//       ref={boardRef}
//       className={cn(
//         "fixed top-0 bottom-0 left-0 w-full sm:w-1/2 bg-neutral-50 dark:bg-zinc-900 shadow-xl transition-transform duration-300 z-50 overflow-y-auto",
//         isOpen ? "translate-x-0" : "-translate-x-full"
//       )}
//     >
//       {/* Header */}
//       <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 border-b bg-neutral-50 dark:bg-zinc-900 dark:border-zinc-700">
//         <h2 className="text-lg font-medium text-neutral-800 dark:text-neutral-100">Notes</h2>
//         <Button size="icon" variant="ghost" onClick={onClose}>
//           <X className="h-5 w-5 text-neutral-500 hover:text-red-500 transition-colors duration-200" />
//         </Button>
//       </div>

//       {/* Notes Grid */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4">
//         {/* Add Note Card */}
//         <Card className="bg-white dark:bg-zinc-800 border border-black/10 shadow-md">
//           <CardContent className="p-3 space-y-2">
//             <Input
//               placeholder="Heading (optional)"
//               value={newHeading}
//               onChange={(e) => setNewHeading(e.target.value)}
//               className="text-sm"
//               onKeyDown={(e) => e.key === "Enter" && handleAddNote()}
//             />
//             <Textarea
//               placeholder="Write your note..."
//               value={newContent}
//               onChange={(e) => {
//                 setNewContent(e.target.value);
//                 autoGrow(e.target);
//               }}
//               className="resize-none text-sm overflow-hidden min-h-[60px]"
//               onKeyDown={(e) => {
//                 if (e.key === "Enter" && !e.shiftKey) {
//                   e.preventDefault();
//                   handleAddNote();
//                 }
//               }}
//             />
//             <div className="flex justify-end">
//               <Button
//                 onClick={handleAddNote}
//                 variant="ghost"
//                 size="icon"
//                 disabled={isCreating}
//                 className="text-green-600 hover:text-green-700 transition-colors duration-200"
//               >
//                 {isCreating ? (
//                   <Loader2 className="w-4 h-4 animate-spin" />
//                 ) : (
//                   <Check className="w-4 h-4" />
//                 )}
//               </Button>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Notes List */}
//         {notes.map((note) => {
//           const isEditing = editingNoteId === note._id;

//           return (
//             <Card
//               key={note._id.toString()}
//               className={cn(
//                 note.color,
//                 "shadow-lg border border-black/10 relative transition-shadow hover:shadow-xl"
//               )}
//             >
//               <CardContent className="p-3 space-y-2">
//                 {isEditing ? (
//                   <>
//                     <Input
//                       value={editedHeading}
//                       onChange={(e) => setEditedHeading(e.target.value)}
//                       className="text-sm"
//                     />
//                     <Textarea
//                       ref={editingTextareaRef}
//                       value={editedContent}
//                       onChange={(e) => {
//                         setEditedContent(e.target.value);
//                         autoGrow(e.target);
//                       }}
//                       className="text-sm resize-none overflow-hidden min-h-[60px]"
//                     />
//                     <div className="flex gap-1 justify-end">
//                       <Button 
//                         size="icon" 
//                         variant="ghost" 
//                         onClick={saveEditedNote}
//                         disabled={isUpdating}
//                       >
//                         {isUpdating ? (
//                           <Loader2 className="w-4 h-4 animate-spin" />
//                         ) : (
//                           <Check className="w-4 h-4 text-green-600 hover:text-green-700" />
//                         )}
//                       </Button>
//                       <Button 
//                         size="icon" 
//                         variant="ghost" 
//                         onClick={() => setEditingNoteId(null)}
//                         disabled={isUpdating}
//                       >
//                         <X className="w-4 h-4 text-neutral-500 hover:text-red-500" />
//                       </Button>
//                     </div>
//                   </>
//                 ) : (
//                   <div 
//                     onClick={() => {
//                       setEditingNoteId(note._id);
//                       setEditedHeading(note.heading || "");
//                       setEditedContent(note.content);
//                     }}
//                     className="cursor-pointer space-y-1"
//                   >
//                     {note.heading && <h3 className="font-semibold text-sm">{note.heading}</h3>}
//                     <p className="text-sm whitespace-pre-wrap">{note.content}</p>
//                   </div>
//                 )}
//                 <Button
//                   size="icon"
//                   variant="link"
//                   onClick={() => handleDeleteNote(note._id)}
//                   className="absolute -top-2 -right-1 text-neutral-500 hover:text-red-600 transition-colors duration-200"
//                 >
//                   <Trash2 className="w-5 h-5" />
//                 </Button>
//               </CardContent>
//             </Card>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// export default NotesBoard;

// "use client";

// import React, { useRef, useEffect, useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Card, CardContent } from "@/components/ui/card";
// import { Check, Trash2, X, Loader2 } from "lucide-react";
// import { cn } from "@/lib/utils";
// import { useQuery, useMutation } from "convex/react";
// import { api } from "../../../../convex/_generated/api";
// import { Id } from "../../../../convex/_generated/dataModel";
// import { toast } from "sonner";

// const NOTE_COLORS = [
//   "bg-yellow-100",
//   "bg-green-100",
//   "bg-pink-100",
//   "bg-blue-100",
//   "bg-purple-100",
//   "bg-orange-100",
// ];

// interface NotesBoardProps {
//   isOpen: boolean;
//   onClose: () => void;
//   documentId?: Id<"documents">;
// }

// const NotesBoard: React.FC<NotesBoardProps> = ({ isOpen, onClose, documentId }) => {
//   const boardRef = useRef<HTMLDivElement>(null);
//   const notes = useQuery(api.notes.get, { documentId });
//   const createNote = useMutation(api.notes.create);
//   const updateNote = useMutation(api.notes.update);
//   const deleteNote = useMutation(api.notes.remove);
  
//   const [newHeading, setNewHeading] = useState("");
//   const [newContent, setNewContent] = useState("");
//   const [editingNoteId, setEditingNoteId] = useState<Id<"notes"> | null>(null);
//   const [editedHeading, setEditedHeading] = useState("");
//   const [editedContent, setEditedContent] = useState("");
//   const [isCreating, setIsCreating] = useState(false);
//   const [isUpdating, setIsUpdating] = useState(false);
//   const editingTextareaRef = useRef<HTMLTextAreaElement>(null);

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (boardRef.current && !boardRef.current.contains(event.target as Node)) {
//         onClose();
//       }
//     };

//     if (isOpen) {
//       document.addEventListener("mousedown", handleClickOutside);
//     }

//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [isOpen, onClose]);

//   const handleAddNote = () => {
//     if (!newContent.trim()) {
//       toast.error("Note content cannot be empty");
//       return;
//     }

//     setIsCreating(true);
//     createNote({
//       heading: newHeading.trim(),
//       content: newContent.trim(),
//       color: NOTE_COLORS[Math.floor(Math.random() * NOTE_COLORS.length)],
//       documentId,
//     })
//       .then(() => {
//         setNewHeading("");
//         setNewContent("");
//         toast.success("Note created");
//       })
//       .catch(() => toast.error("Failed to create note"))
//       .finally(() => setIsCreating(false));
//   };

//   const handleDeleteNote = (id: Id<"notes">) => {
//     deleteNote({ id })
//       .then(() => toast.success("Note deleted"))
//       .catch(() => toast.error("Failed to delete note"));
//   };

//   const saveEditedNote = () => {
//     if (!editingNoteId || !editedContent.trim()) {
//       toast.error("Note content cannot be empty");
//       return;
//     }

//     setIsUpdating(true);
//     updateNote({
//       id: editingNoteId,
//       heading: editedHeading.trim(),
//       content: editedContent.trim(),
//     })
//       .then(() => {
//         setEditingNoteId(null);
//         toast.success("Note updated");
//       })
//       .catch(() => toast.error("Failed to update note"))
//       .finally(() => setIsUpdating(false));
//   };

//   const autoGrow = (el: HTMLTextAreaElement) => {
//     el.style.height = "auto";
//     el.style.height = `${el.scrollHeight}px`;
//   };

//   if (notes === undefined) {
//     return (
//       <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
//         <Loader2 className="h-8 w-8 animate-spin text-white" />
//       </div>
//     );
//   }

//   return (
//     <div
//       ref={boardRef}
//       className={cn(
//         "fixed top-0 bottom-0 left-0 w-full sm:w-1/2 bg-neutral-50 dark:bg-zinc-900 shadow-xl transition-transform duration-300 z-50 overflow-y-auto",
//         isOpen ? "translate-x-0" : "-translate-x-full"
//       )}
//     >
//       {/* Header */}
//       <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 border-b bg-neutral-50 dark:bg-zinc-900 dark:border-zinc-700">
//         <h2 className="text-lg font-medium text-neutral-800 dark:text-neutral-100">
//           {documentId ? "Document Notes" : "Personal Notes"}
//         </h2>
//         <Button size="icon" variant="ghost" onClick={onClose}>
//           <X className="h-5 w-5 text-neutral-500 hover:text-red-500 transition-colors duration-200" />
//         </Button>
//       </div>

//       {/* Notes Grid */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4">
//         {/* Add Note Card */}
//         <Card className="bg-white dark:bg-zinc-800 border border-black/10 shadow-md">
//           <CardContent className="p-3 space-y-2">
//             <Input
//               placeholder="Heading (optional)"
//               value={newHeading}
//               onChange={(e) => setNewHeading(e.target.value)}
//               className="text-sm"
//               onKeyDown={(e) => e.key === "Enter" && handleAddNote()}
//             />
//             <Textarea
//               placeholder="Write your note..."
//               value={newContent}
//               onChange={(e) => {
//                 setNewContent(e.target.value);
//                 autoGrow(e.target);
//               }}
//               className="resize-none text-sm overflow-hidden min-h-[60px]"
//               onKeyDown={(e) => {
//                 if (e.key === "Enter" && !e.shiftKey) {
//                   e.preventDefault();
//                   handleAddNote();
//                 }
//               }}
//             />
//             <div className="flex justify-end">
//               <Button
//                 onClick={handleAddNote}
//                 variant="ghost"
//                 size="icon"
//                 disabled={isCreating}
//                 className="text-green-600 hover:text-green-700 transition-colors duration-200"
//               >
//                 {isCreating ? (
//                   <Loader2 className="w-4 h-4 animate-spin" />
//                 ) : (
//                   <Check className="w-4 h-4" />
//                 )}
//               </Button>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Notes List */}
//         {notes.map((note) => {
//           const isEditing = editingNoteId === note._id;

//           return (
//             <Card
//               key={note._id.toString()}
//               className={cn(
//                 note.color,
//                 "shadow-lg border border-black/10 relative transition-shadow hover:shadow-xl"
//               )}
//             >
//               <CardContent className="p-3 space-y-2">
//                 {isEditing ? (
//                   <>
//                     <Input
//                       value={editedHeading}
//                       onChange={(e) => setEditedHeading(e.target.value)}
//                       className="text-sm"
//                     />
//                     <Textarea
//                       ref={editingTextareaRef}
//                       value={editedContent}
//                       onChange={(e) => {
//                         setEditedContent(e.target.value);
//                         autoGrow(e.target);
//                       }}
//                       className="text-sm resize-none overflow-hidden min-h-[60px]"
//                     />
//                     <div className="flex gap-1 justify-end">
//                       <Button 
//                         size="icon" 
//                         variant="ghost" 
//                         onClick={saveEditedNote}
//                         disabled={isUpdating}
//                       >
//                         {isUpdating ? (
//                           <Loader2 className="w-4 h-4 animate-spin" />
//                         ) : (
//                           <Check className="w-4 h-4 text-green-600 hover:text-green-700" />
//                         )}
//                       </Button>
//                       <Button 
//                         size="icon" 
//                         variant="ghost" 
//                         onClick={() => setEditingNoteId(null)}
//                         disabled={isUpdating}
//                       >
//                         <X className="w-4 h-4 text-neutral-500 hover:text-red-500" />
//                       </Button>
//                     </div>
//                   </>
//                 ) : (
//                   <div 
//                     onClick={() => {
//                       setEditingNoteId(note._id);
//                       setEditedHeading(note.heading || "");
//                       setEditedContent(note.content);
//                     }}
//                     className="cursor-pointer space-y-1"
//                   >
//                     {note.heading && <h3 className="font-semibold text-sm">{note.heading}</h3>}
//                     <p className="text-sm whitespace-pre-wrap">{note.content}</p>
//                   </div>
//                 )}
//                 <Button
//                   size="icon"
//                   variant="link"
//                   onClick={() => handleDeleteNote(note._id)}
//                   className="absolute -top-2 -right-1 text-neutral-500 hover:text-red-600 transition-colors duration-200"
//                 >
//                   <Trash2 className="w-5 h-5" />
//                 </Button>
//               </CardContent>
//             </Card>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// export default NotesBoard;

"use client";

import React, { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Check, Trash2, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { toast } from "sonner";

const NOTE_COLORS = [
  "bg-yellow-100",
  "bg-green-100",
  "bg-pink-100",
  "bg-blue-100",
  "bg-purple-100",
  "bg-orange-100",
];

interface NotesBoardProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "document" | "organization";
  documentId?: Id<"documents">;
}

const NotesBoard: React.FC<NotesBoardProps> = ({ isOpen, onClose, mode, documentId }) => {
  const boardRef = useRef<HTMLDivElement>(null);
  const notes = useQuery(
    mode === "document" ? api.notes.getDocumentNotes : api.notes.getOrganizationNotes,
    mode === "document" ? { documentId: documentId! } : {}
  );
  
  const createNote = useMutation(
    mode === "document" ? api.notes.createDocumentNote : api.notes.createOrganizationNote
  );
  const updateNote = useMutation(api.notes.updateNote);
  const deleteNote = useMutation(api.notes.deleteNote);
  
  const [newHeading, setNewHeading] = useState("");
  const [newContent, setNewContent] = useState("");
  const [editingNoteId, setEditingNoteId] = useState<Id<"notes"> | null>(null);
  const [editedHeading, setEditedHeading] = useState("");
  const [editedContent, setEditedContent] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedColor, setSelectedColor] = useState(NOTE_COLORS[0]);
  const editingTextareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (boardRef.current && !boardRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  const handleAddNote = () => {
    if (!newContent.trim()) {
      toast.error("Note content cannot be empty");
      return;
    }

    setIsCreating(true);
    const createArgs = mode === "document" 
      ? { 
          documentId: documentId!, 
          heading: newHeading.trim(), 
          content: newContent.trim(), 
          color: selectedColor 
        }
      : { 
          heading: newHeading.trim(), 
          content: newContent.trim(), 
          color: selectedColor 
        };

    createNote(createArgs)
      .then(() => {
        setNewHeading("");
        setNewContent("");
        toast.success("Note created");
      })
      .catch(() => toast.error("Failed to create note"))
      .finally(() => setIsCreating(false));
  };

  const handleDeleteNote = (id: Id<"notes">) => {
    deleteNote({ id })
      .then(() => toast.success("Note deleted"))
      .catch(() => toast.error("Failed to delete note"));
  };

  const saveEditedNote = () => {
    if (!editingNoteId || !editedContent.trim()) {
      toast.error("Note content cannot be empty");
      return;
    }

    setIsUpdating(true);
    updateNote({
      id: editingNoteId,
      heading: editedHeading.trim(),
      content: editedContent.trim(),
    })
      .then(() => {
        setEditingNoteId(null);
        toast.success("Note updated");
      })
      .catch(() => toast.error("Failed to update note"))
      .finally(() => setIsUpdating(false));
  };

  const autoGrow = (el: HTMLTextAreaElement) => {
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  };

  if (notes === undefined) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
      </div>
    );
  }

  return (
    <div
      ref={boardRef}
      className={cn(
        "fixed top-0 bottom-0 left-0 w-full sm:w-1/2 bg-neutral-50 dark:bg-zinc-900 shadow-xl transition-transform duration-300 z-50 overflow-y-auto",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 border-b bg-neutral-50 dark:bg-zinc-900 dark:border-zinc-700">
        <h2 className="text-lg font-medium text-neutral-800 dark:text-neutral-100">
          {mode === "document" ? "Document Notes" : "Organization Notes"}
        </h2>
        <Button size="icon" variant="ghost" onClick={onClose}>
          <X className="h-5 w-5 text-neutral-500 hover:text-red-500 transition-colors duration-200" />
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4">
        <Card className="bg-white dark:bg-zinc-800 border border-black/10 shadow-md">
          <CardContent className="p-3 space-y-2">
            <Input
              placeholder="Heading (optional)"
              value={newHeading}
              onChange={(e) => setNewHeading(e.target.value)}
              className="text-sm"
              onKeyDown={(e) => e.key === "Enter" && handleAddNote()}
            />
            <Textarea
              placeholder="Write your note..."
              value={newContent}
              onChange={(e) => {
                setNewContent(e.target.value);
                autoGrow(e.target);
              }}
              className="resize-none text-sm overflow-hidden min-h-[60px]"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleAddNote();
                }
              }}
            />
            <div className="flex items-center justify-between">
              <div className="flex gap-1">
                {NOTE_COLORS.map((color) => (
                  <button
                    key={color}
                    className={`w-5 h-5 rounded-full ${color} ${selectedColor === color ? 'ring-2 ring-offset-2 ring-neutral-400' : ''}`}
                    onClick={() => setSelectedColor(color)}
                  />
                ))}
              </div>
              <Button
                onClick={handleAddNote}
                variant="ghost"
                size="icon"
                disabled={isCreating}
                className="text-green-600 hover:text-green-700 transition-colors duration-200"
              >
                {isCreating ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Check className="w-4 h-4" />
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {notes.map((note) => {
          const isEditing = editingNoteId === note._id;

          return (
            <Card
              key={note._id.toString()}
              className={cn(
                note.color,
                "shadow-lg border border-black/10 relative transition-shadow hover:shadow-xl"
              )}
            >
              <CardContent className="p-3 space-y-2">
                {isEditing ? (
                  <>
                    <Input
                      value={editedHeading}
                      onChange={(e) => setEditedHeading(e.target.value)}
                      className="text-sm"
                    />
                    <Textarea
                      ref={editingTextareaRef}
                      value={editedContent}
                      onChange={(e) => {
                        setEditedContent(e.target.value);
                        autoGrow(e.target);
                      }}
                      className="text-sm resize-none overflow-hidden min-h-[60px]"
                    />
                    <div className="flex gap-1 justify-end">
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        onClick={saveEditedNote}
                        disabled={isUpdating}
                      >
                        {isUpdating ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Check className="w-4 h-4 text-green-600 hover:text-green-700" />
                        )}
                      </Button>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        onClick={() => setEditingNoteId(null)}
                        disabled={isUpdating}
                      >
                        <X className="w-4 h-4 text-neutral-500 hover:text-red-500" />
                      </Button>
                    </div>
                  </>
                ) : (
                  <div 
                    onClick={() => {
                      setEditingNoteId(note._id);
                      setEditedHeading(note.heading || "");
                      setEditedContent(note.content);
                    }}
                    className="cursor-pointer space-y-1"
                  >
                    {note.heading && <h3 className="font-semibold text-sm">{note.heading}</h3>}
                    <p className="text-sm whitespace-pre-wrap">{note.content}</p>
                  </div>
                )}
                <Button
                  size="icon"
                  variant="link"
                  onClick={() => handleDeleteNote(note._id)}
                  className="absolute -top-2 -right-1 text-neutral-500 hover:text-red-600 transition-colors duration-200"
                >
                  <Trash2 className="w-5 h-5" />
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default NotesBoard;