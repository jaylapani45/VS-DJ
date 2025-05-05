"use client";

import React, { useEffect, useRef } from "react";
import { Plus, Trash2, Pencil, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

interface KanbanBoardProps {
  isOpen: boolean;
  onClose: () => void;
  documentId: Id<"documents">;
}

const columnLabels: Record<string, string> = {
  todo: "Todo",
  inProgress: "In Progress",
  review: "Review",
  done: "Done",
};

const KanbanBoard: React.FC<KanbanBoardProps> = ({ isOpen, onClose, documentId }) => {
  const boardRef = useRef<HTMLDivElement>(null);
  const boardData = useQuery(api.kanban.getBoard, { documentId });
  const createTask = useMutation(api.kanban.createTask);
  const updateTask = useMutation(api.kanban.updateTask);
  const moveTask = useMutation(api.kanban.moveTask);
  const deleteTask = useMutation(api.kanban.deleteTask);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (boardRef.current && !boardRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleDragStart = (e: React.DragEvent, taskId: Id<"kanbanTasks">) => {
    e.dataTransfer.setData("taskId", taskId);
  };

  const handleDrop = async (e: React.DragEvent, columnId: Id<"kanbanColumns">) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("taskId") as Id<"kanbanTasks">;
    if (!taskId) return;

    const targetColumn = boardData?.columns.find(col => col._id === columnId);
    if (!targetColumn) return;

    const newPosition = targetColumn.tasks.length;
    await moveTask({ taskId, newColumnId: columnId, newPosition });
  };

  const handleAddTask = async (columnId: Id<"kanbanColumns">) => {
    if (!boardData?._id) return;
    await createTask({
      boardId: boardData._id,
      columnId,
      content: "New task",
    });
  };

  const handleEditTask = async (taskId: Id<"kanbanTasks">, content: string) => {
    await updateTask({ taskId, content });
  };

  const handleDeleteTask = async (taskId: Id<"kanbanTasks">) => {
    await deleteTask({ taskId });
  };

  if (!boardData) {
    return null;
  }

  return (
    <div
      ref={boardRef}
      className={cn(
        "fixed top-0 bottom-0 right-0 w-full sm:w-3/4 bg-white dark:bg-zinc-900 shadow-xl transition-transform duration-300 z-50 overflow-y-auto transform",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}
    >
      <div className="p-6 flex justify-between items-center border-b">
        <h2 className="text-xl font-semibold tracking-tight">{boardData.title}</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          aria-label="Close Kanban Board"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      <div className="p-4 overflow-y-auto h-[calc(100vh-64px)]">
        <div className="grid grid-cols-4 gap-3 h-full">
          {boardData.columns.map((column) => (
            <div
              key={column._id}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleDrop(e, column._id)}
              className={cn(
                "rounded-lg p-3 flex flex-col h-full",
                "bg-gray-100"
              )}
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold">
                  {columnLabels[column.type]}{" "}
                  <span className="text-sm text-gray-500 font-normal">
                    {column.tasks.length}
                  </span>
                </h3>
                {column.type === "todo" && (
                  <button
                    onClick={() => handleAddTask(column._id)}
                    className="text-gray-500 hover:text-black"
                    aria-label={`Add task to ${column.type}`}
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                )}
              </div>

              <div className="flex-1 overflow-y-auto">
                {column.tasks.map((task) => (
                  <div
                    key={task._id}
                    className="mb-2 group"
                  >
                    <div
                      draggable
                      onDragStart={(e) => handleDragStart(e, task._id)}
                      className="bg-white p-2 rounded shadow cursor-pointer hover:bg-gray-50 flex justify-between items-start gap-2 relative border border-transparent hover:border-gray-200"
                    >
                      <span
                        onClick={() => {
                          if (column.type === "todo") {
                            const newContent = prompt("Edit task:", task.content);
                            if (newContent) {
                              handleEditTask(task._id, newContent);
                            }
                          }
                        }}
                        className="flex-1 whitespace-pre-wrap break-words"
                      >
                        {task.content}
                      </span>
                      <div className="flex flex-col gap-1 items-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Trash2
                          className="h-4 w-4 text-red-500 hover:text-red-700 cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteTask(task._id);
                          }}
                          aria-label="Delete task"
                        />
                        {column.type === "todo" && (
                          <Pencil
                            className="h-4 w-4 text-blue-500 hover:text-blue-700 cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              const newContent = prompt("Edit task:", task.content);
                              if (newContent) {
                                handleEditTask(task._id, newContent);
                              }
                            }}
                            aria-label="Edit task"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default KanbanBoard; 