// "use client";

// import React from "react";
// import { StickyNote } from "lucide-react";
// import { Button } from "@/components/ui/button";

// interface NotesToggleProps {
//   onOpen: () => void;
// }

// const NotesToggle: React.FC<NotesToggleProps> = ({ onOpen }) => {
//   return (
//     <Button
//       variant="ghost"
//       size="icon"
//       onClick={onOpen}
//       className="hover:bg-neutral-200/80 rounded-sm"
//     >
//       <StickyNote className="h-5 w-5" />
//       <span className="sr-only">Open Notes</span>
//     </Button>
//   );
// };

// export default NotesToggle;

// "use client";

// import React from "react";
// import { StickyNote } from "lucide-react";
// import { Button } from "@/components/ui/button";

// interface NotesToggleProps {
//   onOpen: () => void;
// }

// const NotesToggle: React.FC<NotesToggleProps> = ({ onOpen }) => {
//   return (
//     <Button
//       variant="ghost"
//       size="icon"
//       onClick={onOpen}
//       className="hover:bg-neutral-200/80 rounded-sm"
//     >
//       <StickyNote className="h-5 w-5" />
//       <span className="sr-only">Open Notes</span>
//     </Button>
//   );
// };

// export default NotesToggle;

"use client";

import React from "react";
import { StickyNote } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NotesToggleProps {
  onOpen: () => void;
}

const NotesToggle: React.FC<NotesToggleProps> = ({ onOpen }) => {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onOpen}
      className="hover:bg-neutral-200/80 rounded-sm"
    >
      <StickyNote className="h-5 w-5" />
      <span className="sr-only">Open Notes</span>
    </Button>
  );
};

export default NotesToggle;