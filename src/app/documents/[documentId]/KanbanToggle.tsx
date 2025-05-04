"use client";

import React from "react";
import { KanbanSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

interface KanbanToggleProps {
  onOpen: (boardId: Id<"kanbanBoards">) => void;
}

const KanbanToggle: React.FC<KanbanToggleProps> = ({ onOpen }) => {
  const createBoard = useMutation(api.kanban.createBoard);

  const handleClick = async () => {
    const boardId = await createBoard({ title: "My Kanban Board" });
    onOpen(boardId); // boardId is already the correct type
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleClick}
      className="hover:bg-neutral-200/80 rounded-sm"
    >
      <KanbanSquare className="h-5 w-5" />
      <span className="sr-only">Open Kanban Board</span>
    </Button>
  );
};

export default KanbanToggle;

