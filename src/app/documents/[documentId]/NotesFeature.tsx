// "use client";

// import React, { useState } from "react";
// import NotesBoard from "./NotesBoard";
// import NotesToggle from "./NotesToggle";

// const NotesFeature: React.FC = () => {
//   const [isOpen, setIsOpen] = useState(false);

//   return (
//     <>
//       <NotesToggle onOpen={() => setIsOpen(true)} />
//       <NotesBoard isOpen={isOpen} onClose={() => setIsOpen(false)} />
//     </>
//   );
// };

// export default NotesFeature;

// "use client";

// import React, { useState } from "react";
// import NotesBoard from "./NotesBoard";
// import NotesToggle from "./NotesToggle";
// import { Id } from "../../../../convex/_generated/dataModel";

// interface NotesFeatureProps {
//   documentId?: Id<"documents">;
// }

// const NotesFeature: React.FC<NotesFeatureProps> = ({ documentId }) => {
//   const [isOpen, setIsOpen] = useState(false);

//   return (
//     <>
//       <NotesToggle onOpen={() => setIsOpen(true)} />
//       <NotesBoard 
//         isOpen={isOpen} 
//         onClose={() => setIsOpen(false)} 
//         documentId={documentId} 
//       />
//     </>
//   );
// };

// export default NotesFeature;

"use client";

import React, { useState } from "react";
import NotesBoard from "./NotesBoard";
import NotesToggle from "./NotesToggle";
import { Id } from "../../../../convex/_generated/dataModel";

interface DocumentNotesProps {
  mode: "document";
  documentId: Id<"documents">;
}

interface OrganizationNotesProps {
  mode: "organization";
}

type NotesFeatureProps = DocumentNotesProps | OrganizationNotesProps;

const NotesFeature: React.FC<NotesFeatureProps> = (props) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <NotesToggle onOpen={() => setIsOpen(true)} />
      <NotesBoard 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
        mode={props.mode}
        documentId={props.mode === "document" ? props.documentId : undefined}
      />
    </>
  );
};

export default NotesFeature;