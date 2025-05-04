"use client";

import React, { useEffect, useRef, useState } from "react";
import { Plus, Trash2, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { v4 as uuidv4 } from "uuid";

type ColumnType = "todo" | "inProgress" | "review" | "done";

interface Task {
  id: string;
  content: string;
  isEditing?: boolean;
}

interface KanbanBoardProps {
  isOpen: boolean;
  onClose: () => void;
}

const initialData: Record<ColumnType, Task[]> = {
  todo: [
    { id: uuidv4(), content: "Setup project" },
    { id: uuidv4(), content: "Design UI" },
  ],
  inProgress: [{ id: uuidv4(), content: "Build Kanban board" }],
  review: [],
  done: [{ id: uuidv4(), content: "Requirement analysis" }],
};

const columnLabels: Record<ColumnType, string> = {
  todo: "Todo",
  inProgress: "In Progress",
  review: "Review",
  done: "Done",
};

const KanbanBoard: React.FC<KanbanBoardProps> = ({ isOpen, onClose }) => {
  const boardRef = useRef<HTMLDivElement>(null);
  const [columns, setColumns] = useState(initialData);
  const [draggingTask, setDraggingTask] = useState<Task | null>(null);
  const [draggingFrom, setDraggingFrom] = useState<ColumnType | null>(null);
  const [dragOverCol, setDragOverCol] = useState<ColumnType | null>(null);

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

  const handleDragStart = (task: Task, from: ColumnType) => {
    setDraggingTask(task);
    setDraggingFrom(from);
  };

  const handleDrop = (to: ColumnType) => {
    if (!draggingTask || draggingFrom === null || draggingFrom === to) return;

    setColumns((prev) => {
      const fromTasks = prev[draggingFrom].filter((t) => t.id !== draggingTask.id);
      const toTasks = [...prev[to], { ...draggingTask, isEditing: false }];
      return {
        ...prev,
        [draggingFrom]: fromTasks,
        [to]: toTasks,
      };
    });

    setDraggingTask(null);
    setDraggingFrom(null);
    setDragOverCol(null);
  };

  const handleAddTask = (col: ColumnType) => {
    const newTask: Task = { id: uuidv4(), content: "", isEditing: true };
    setColumns((prev) => ({
      ...prev,
      [col]: [newTask, ...prev[col]],
    }));
  };

  const handleChangeContent = (col: ColumnType, id: string, value: string) => {
    setColumns((prev) => ({
      ...prev,
      [col]: prev[col].map((task) =>
        task.id === id ? { ...task, content: value } : task
      ),
    }));
  };

  const handleSave = (col: ColumnType, id: string) => {
    setColumns((prev) => ({
      ...prev,
      [col]: prev[col]
        .map((task) =>
          task.id === id ? { ...task, isEditing: false } : task
        )
        .filter((task) => task.content.trim() !== "")
    }));
  };

  const handleEdit = (col: ColumnType, id: string) => {
    if (col !== "todo") return;
    setColumns((prev) => ({
      ...prev,
      [col]: prev[col].map((task) =>
        task.id === id ? { ...task, isEditing: true } : task
      ),
    }));
  };

  const handleDeleteTask = (col: ColumnType, id: string) => {
    setColumns((prev) => ({
      ...prev,
      [col]: prev[col].filter((task) => task.id !== id),
    }));
  };

  return (
    <div
      ref={boardRef}
      className={cn(
        "fixed top-0 bottom-0 right-0 w-full sm:w-3/4 bg-white dark:bg-zinc-900 shadow-xl transition-transform duration-300 z-50 overflow-y-auto transform",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}
    >
      <div className="p-6 flex justify-between items-center border-b">
        <h2 className="text-xl font-semibold tracking-tight">Kanban Board</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          aria-label="Close Kanban Board"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </Button>
      </div>

      <div className="p-4 overflow-y-auto h-full">
        <div className="grid grid-cols-4 gap-3 h-full">
          {Object.entries(columns).map(([key, tasks]) => {
            const colKey = key as ColumnType;
            return (
              <div
                key={colKey}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOverCol(colKey);
                }}
                onDragLeave={() => setDragOverCol(null)}
                onDrop={() => handleDrop(colKey)}
                className={cn(
                  "rounded-lg p-3 flex flex-col max-h-[calc(100vh-115px)] overflow-y-auto transition-all",
                  dragOverCol === colKey ? "bg-neutral-200 border-2 border-neutral-950" : "bg-gray-100"
                )}
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold">
                    {columnLabels[colKey]}{" "}
                    <span className="text-sm text-gray-500 font-normal">
                      {tasks.length}
                    </span>
                  </h3>
                  {colKey === "todo" && (
                    <button
                      onClick={() => handleAddTask(colKey)}
                      className="text-gray-500 hover:text-black"
                      aria-label={`Add task to ${colKey}`}
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {tasks.map((task) => (
                  <div key={task.id} className="mb-2 group">
                    {task.isEditing ? (
                      <textarea
                        ref={(el) => {
                          if (el) {
                            el.style.height = "auto";
                            el.style.height = `${el.scrollHeight}px`;
                          }
                        }}
                        value={task.content}
                        onChange={(e) =>
                          handleChangeContent(colKey, task.id, e.target.value)
                        }
                        onBlur={() => handleSave(colKey, task.id)}
                        autoFocus
                        placeholder="Enter task..."
                        className="w-full p-2 bg-white rounded shadow resize-none overflow-hidden min-h-[40px]"
                        onInput={(e) => {
                          const target = e.target as HTMLTextAreaElement;
                          target.style.height = "auto";
                          target.style.height = `${target.scrollHeight}px`;
                        }}
                      />
                    ) : (
                      <div
                        draggable
                        onDragStart={() => handleDragStart(task, colKey)}
                        className="bg-white p-2 rounded shadow cursor-pointer hover:bg-gray-50 flex justify-between items-start gap-2 relative"
                      >
                        <span
                          onClick={() => {
                            if (colKey === "todo") handleEdit(colKey, task.id);
                          }}
                          className="flex-1 whitespace-pre-wrap break-words"
                        >
                          {task.content}
                        </span>
                        <div className="flex flex-col gap-1 items-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Trash2
                            className="h-4 w-4 text-red-500 hover:text-red-700"
                            onClick={() => handleDeleteTask(colKey, task.id)}
                            aria-label="Delete task"
                          />
                          {colKey === "todo" && (
                            <Pencil
                              className="h-4 w-4 text-blue-500 hover:text-blue-700"
                              onClick={() => handleEdit(colKey, task.id)}
                              aria-label="Edit task"
                            />
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default KanbanBoard;



// "use client";

// import React, { useEffect, useRef, useState } from "react";
// import { Plus, Trash2, Pencil } from "lucide-react";
// import { cn } from "@/lib/utils";
// import { Button } from "@/components/ui/button";
// import { useQuery, useMutation } from "convex/react";
// import { api } from "../../../../convex/_generated/api";
// import { Id } from "../../../../convex/_generated/dataModel";
// import { toast } from "sonner";

// interface KanbanBoardProps {
//   isOpen: boolean;
//   onClose: () => void;
//   documentId?: Id<"documents">;
// }

// const KanbanBoard: React.FC<KanbanBoardProps> = ({ isOpen, onClose, documentId }) => {
//   const boardRef = useRef<HTMLDivElement>(null);
//   const boardData = useQuery(api.kanban.getBoardForDocument, 
//     documentId ? { documentId } : "skip");
//   const createTask = useMutation(api.kanbanTasks.createTask);
//   const updateTask = useMutation(api.kanbanTasks.updateTask);
//   const moveTask = useMutation(api.kanbanTasks.moveTask);
//   const deleteTask = useMutation(api.kanbanTasks.deleteTask);
  
//   const [draggingTask, setDraggingTask] = useState<Id<"kanbanTasks"> | null>(null);
//   const [dragOverCol, setDragOverCol] = useState<Id<"kanbanColumns"> | null>(null);
//   const [editingTask, setEditingTask] = useState<{
//     taskId: Id<"kanbanTasks">;
//     content: string;
//   } | null>(null);

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

//   const handleDragStart = (taskId: Id<"kanbanTasks">) => {
//     setDraggingTask(taskId);
//   };

//   const handleDrop = async (columnId: Id<"kanbanColumns">) => {
//     if (!draggingTask || !boardData) return;

//     try {
//       await moveTask({
//         taskId: draggingTask,
//         newColumnId: columnId,
//         newPosition: 0,
//       });
//     } catch (error) {
//       toast.error("Failed to move task");
//     } finally {
//       setDraggingTask(null);
//       setDragOverCol(null);
//     }
//   };

//   const handleAddTask = async (columnId: Id<"kanbanColumns">) => {
//     if (!boardData) return;
    
//     try {
//       await createTask({
//         boardId: boardData._id,
//         columnId,
//         content: "New task",
//       });
//     } catch (error) {
//       toast.error("Failed to create task");
//     }
//   };

//   const handleEditStart = (taskId: Id<"kanbanTasks">, content: string) => {
//     setEditingTask({ taskId, content });
//   };

//   const handleEditSave = async () => {
//     if (!editingTask) return;

//     try {
//       await updateTask({
//         taskId: editingTask.taskId,
//         content: editingTask.content,
//       });
//       setEditingTask(null);
//     } catch (error) {
//       toast.error("Failed to update task");
//     }
//   };

//   const handleDeleteTask = async (taskId: Id<"kanbanTasks">) => {
//     try {
//       await deleteTask({ taskId });
//       toast.success("Task deleted");
//     } catch (error) {
//       toast.error("Failed to delete task");
//     }
//   };

//   if (!boardData) return null;

//   return (
//     <div
//       ref={boardRef}
//       className={cn(
//         "fixed top-0 bottom-0 right-0 w-full sm:w-3/4 bg-white dark:bg-zinc-900 shadow-xl transition-transform duration-300 z-50 overflow-y-auto",
//         isOpen ? "translate-x-0" : "translate-x-full"
//       )}
//     >
//       <div className="p-6 flex justify-between items-center border-b">
//         <h2 className="text-xl font-semibold tracking-tight">
//           {boardData.title}
//         </h2>
//         <Button
//           variant="ghost"
//           size="icon"
//           onClick={onClose}
//           aria-label="Close Kanban Board"
//         >
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             fill="none"
//             viewBox="0 0 24 24"
//             strokeWidth={1.5}
//             stroke="currentColor"
//             className="w-5 h-5"
//           >
//             <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
//           </svg>
//         </Button>
//       </div>

//       <div className="p-4 overflow-y-auto h-full">
//         <div className="grid grid-cols-4 gap-3 h-full">
//           {boardData.columns.map((column) => (
//             <div
//               key={column._id.toString()}
//               onDragOver={(e) => {
//                 e.preventDefault();
//                 setDragOverCol(column._id);
//               }}
//               onDragLeave={() => setDragOverCol(null)}
//               onDrop={() => handleDrop(column._id)}
//               className={cn(
//                 "rounded-lg p-3 flex flex-col max-h-[calc(100vh-115px)] overflow-y-auto transition-all",
//                 dragOverCol === column._id ? "bg-neutral-200 border-2 border-neutral-950" : "bg-gray-100"
//               )}
//             >
//               <div className="flex justify-between items-center mb-2">
//                 <h3 className="font-semibold">
//                   {column.title}{" "}
//                   <span className="text-sm text-gray-500 font-normal">
//                     {column.tasks.length}
//                   </span>
//                 </h3>
//                 <button
//                   onClick={() => handleAddTask(column._id)}
//                   className="text-gray-500 hover:text-black"
//                   aria-label={`Add task to ${column.title}`}
//                 >
//                   <Plus className="h-4 w-4" />
//                 </button>
//               </div>

//               {column.tasks.map((task) => (
//                 <div key={task._id.toString()} className="mb-2 group">
//                   {editingTask?.taskId === task._id ? (
//                     <textarea
//                       value={editingTask.content}
//                       onChange={(e) => setEditingTask({
//                         ...editingTask,
//                         content: e.target.value,
//                       })}
//                       onBlur={handleEditSave}
//                       autoFocus
//                       className="w-full p-2 bg-white rounded shadow resize-none overflow-hidden min-h-[40px]"
//                       onKeyDown={(e) => {
//                         if (e.key === "Enter") {
//                           e.preventDefault();
//                           handleEditSave();
//                         } else if (e.key === "Escape") {
//                           setEditingTask(null);
//                         }
//                       }}
//                     />
//                   ) : (
//                     <div
//                       draggable
//                       onDragStart={() => handleDragStart(task._id)}
//                       className="bg-white p-2 rounded shadow cursor-pointer hover:bg-gray-50 flex justify-between items-start gap-2 relative"
//                     >
//                       <span
//                         onClick={() => handleEditStart(task._id, task.content)}
//                         className="flex-1 whitespace-pre-wrap break-words"
//                       >
//                         {task.content}
//                       </span>
//                       <div className="flex flex-col gap-1 items-center opacity-0 group-hover:opacity-100 transition-opacity">
//                         <Trash2
//                           className="h-4 w-4 text-red-500 hover:text-red-700"
//                           onClick={() => handleDeleteTask(task._id)}
//                           aria-label="Delete task"
//                         />
//                         <Pencil
//                           className="h-4 w-4 text-blue-500 hover:text-blue-700"
//                           onClick={() => handleEditStart(task._id, task.content)}
//                           aria-label="Edit task"
//                         />
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default KanbanBoard;
