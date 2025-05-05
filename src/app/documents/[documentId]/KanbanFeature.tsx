"use client";

import { useState, useEffect } from "react";
import { KanbanSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Id } from "../../../../convex/_generated/dataModel";
import KanbanBoard from "./KanbanBoard";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useOrganization } from "@clerk/nextjs";

interface KanbanFeatureProps {
  documentId: Id<"documents">;
}

export const KanbanFeature = ({ documentId }: KanbanFeatureProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { organization } = useOrganization();
  const board = useQuery(api.kanban.getBoard, { documentId });
  const createBoard = useMutation(api.kanban.createBoard);

  useEffect(() => {
    if (isOpen && !board) {
      createBoard({
        documentId,
        title: organization ? `${organization.name} Kanban Board` : "My Kanban Board",
      });
    }
  }, [isOpen, board, documentId, createBoard, organization]);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="hover:bg-neutral-200/80 rounded-sm"
        onClick={() => setIsOpen(true)}
      >
        <KanbanSquare className="h-5 w-5" />
        <span className="sr-only">Open Kanban Board</span>
      </Button>

      <KanbanBoard
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        documentId={documentId}
      />
    </>
  );
}; 