"use client";

import React, { useState } from "react";
import KanbanBoard from "./KanbanBoard";
import KanbanToggle from "./KanbanToggle";
import { Id } from "../../../../convex/_generated/dataModel";

const KanbanFeature: React.FC = () => {
  const [currentBoardId, setCurrentBoardId] = useState<Id<"kanbanBoards"> | null>(null);

  return (
    <>
      <KanbanToggle onOpen={setCurrentBoardId} />
      {currentBoardId && (
        <KanbanBoard 
          isOpen={true}
          onClose={() => setCurrentBoardId(null)}
          boardId={currentBoardId}
        />
      )}
    </>
  );
};

export default KanbanFeature;
