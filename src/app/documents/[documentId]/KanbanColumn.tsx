"use client";

import { useState } from "react";
import { Id } from "../../../../convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Trash2, Pencil } from "lucide-react";

interface KanbanColumnProps {
  column: {
    _id: Id<"kanbanColumns">;
    title: string;
    type: string;
    order: number;
  };
  tasks: {
    _id: Id<"kanbanTasks">;
    content: string;
    position: number;
  }[];
  onTaskMove: (taskId: Id<"kanbanTasks">, columnId: Id<"kanbanColumns">, position: number) => void;
  onTaskDelete: (taskId: Id<"kanbanTasks">) => void;
}

export const KanbanColumn = ({ column, tasks, onTaskMove, onTaskDelete }: KanbanColumnProps) => {
  const [draggingTask, setDraggingTask] = useState<Id<"kanbanTasks"> | null>(null);
  const [dragOverPosition, setDragOverPosition] = useState<number | null>(null);

  const handleDragStart = (taskId: Id<"kanbanTasks">) => {
    setDraggingTask(taskId);
  };

  const handleDragOver = (e: React.DragEvent, position: number) => {
    e.preventDefault();
    setDragOverPosition(position);
  };

  const handleDrop = (e: React.DragEvent, targetColumnId: Id<"kanbanColumns">, position: number) => {
    e.preventDefault();
    if (draggingTask) {
      onTaskMove(draggingTask, targetColumnId, position);
    }
    setDraggingTask(null);
    setDragOverPosition(null);
  };

  return (
    <div className="w-64 flex-shrink-0">
      <div className="bg-gray-100 rounded-lg p-3">
        <h3 className="font-semibold mb-2">
          {column.title} <span className="text-sm text-gray-500">({tasks.length})</span>
        </h3>
        <div className="space-y-2">
          {tasks
            .sort((a, b) => a.position - b.position)
            .map((task, index) => (
              <div
                key={task._id}
                draggable
                onDragStart={() => handleDragStart(task._id)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDrop={(e) => handleDrop(e, column._id, index)}
                className={cn(
                  "bg-white p-2 rounded shadow cursor-pointer hover:bg-gray-50 group relative",
                  dragOverPosition === index && "border-2 border-blue-500"
                )}
              >
                <div className="flex justify-between items-start gap-2">
                  <span className="flex-1 whitespace-pre-wrap break-words">
                    {task.content}
                  </span>
                  <div className="flex flex-col gap-1 items-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => onTaskDelete(task._id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                    {column.type === "todo" && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                      >
                        <Pencil className="h-4 w-4 text-blue-500" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          {dragOverPosition === tasks.length && (
            <div
              className="border-2 border-dashed border-blue-500 rounded p-2"
              onDragOver={(e) => handleDragOver(e, tasks.length)}
              onDrop={(e) => handleDrop(e, column._id, tasks.length)}
            />
          )}
        </div>
      </div>
    </div>
  );
}; 