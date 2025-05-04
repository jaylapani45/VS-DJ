// types/kanban.ts
export type Task = {
    id: string;
    content: string;
    isEditing?: boolean;
  };
  
  export type ColumnType = "todo" | "inProgress" | "review" | "done";
  