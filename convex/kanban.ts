import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

// Get board for a document
export const getBoard = query({
  args: { documentId: v.id("documents") },
  handler: async (ctx, args) => {
    const board = await ctx.db
      .query("kanbanBoards")
      .withIndex("by_document_id", (q) => q.eq("documentId", args.documentId))
      .first();

    if (!board) return null;

    const columns = await ctx.db
      .query("kanbanColumns")
      .withIndex("by_board_id", (q) => q.eq("boardId", board._id))
      .collect();

    const tasks = await ctx.db
      .query("kanbanTasks")
      .withIndex("by_board_id", (q) => q.eq("boardId", board._id))
      .collect();

    const columnsWithTasks = columns.map((column) => ({
      ...column,
      tasks: tasks
        .filter((task) => task.columnId === column._id)
        .sort((a, b) => a.position - b.position),
    }));

    return {
      ...board,
      columns: columnsWithTasks.sort((a, b) => a.order - b.order),
    };
  },
});

// Create a new board
export const createBoard = mutation({
  args: {
    documentId: v.id("documents"),
    title: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const board = await ctx.db.insert("kanbanBoards", {
      documentId: args.documentId,
      title: args.title,
      ownerId: identity.subject,
      organizationId: identity.orgId,
    });

    // Create default columns
    const columns = [
      { title: "Todo", type: "todo", order: 0 },
      { title: "In Progress", type: "inProgress", order: 1 },
      { title: "Review", type: "review", order: 2 },
      { title: "Done", type: "done", order: 3 },
    ];

    for (const column of columns) {
      await ctx.db.insert("kanbanColumns", {
        boardId: board,
        ...column,
      });
    }

    return board;
  },
});

// Create a new task
export const createTask = mutation({
  args: {
    boardId: v.id("kanbanBoards"),
    columnId: v.id("kanbanColumns"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    // Get the highest position in the column
    const tasks = await ctx.db
      .query("kanbanTasks")
      .withIndex("by_column_id", (q) => q.eq("columnId", args.columnId))
      .collect();

    const position = tasks.length > 0
      ? Math.max(...tasks.map((t) => t.position)) + 1
      : 0;

    return await ctx.db.insert("kanbanTasks", {
      boardId: args.boardId,
      columnId: args.columnId,
      content: args.content,
      position,
      ownerId: identity.subject,
    });
  },
});

// Update task content
export const updateTask = mutation({
  args: {
    taskId: v.id("kanbanTasks"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const task = await ctx.db.get(args.taskId);
    if (!task) throw new Error("Task not found");

    await ctx.db.patch(args.taskId, {
      content: args.content,
    });
  },
});

// Move task to different column
export const moveTask = mutation({
  args: {
    taskId: v.id("kanbanTasks"),
    newColumnId: v.id("kanbanColumns"),
    newPosition: v.number(),
  },
  handler: async (ctx, args) => {
    const task = await ctx.db.get(args.taskId);
    if (!task) throw new Error("Task not found");

    // Update positions of other tasks in the target column
    const tasksInTargetColumn = await ctx.db
      .query("kanbanTasks")
      .withIndex("by_column_id", (q) => q.eq("columnId", args.newColumnId))
      .collect();

    for (const t of tasksInTargetColumn) {
      if (t.position >= args.newPosition) {
        await ctx.db.patch(t._id, {
          position: t.position + 1,
        });
      }
    }

    // Move the task
    await ctx.db.patch(args.taskId, {
      columnId: args.newColumnId,
      position: args.newPosition,
    });
  },
});

// Delete task
export const deleteTask = mutation({
  args: {
    taskId: v.id("kanbanTasks"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.taskId);
  },
});

// Get all boards for a document
export const getBoards = query({
  args: {
    documentId: v.optional(v.id("documents")),
    organizationId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const ownerId = identity.subject;

    if (args.documentId) {
      return await ctx.db
        .query("kanbanBoards")
        .withIndex("by_document_id", (q) => q.eq("documentId", args.documentId))
        .collect();
    } else if (args.organizationId) {
      return await ctx.db
        .query("kanbanBoards")
        .withIndex("by_organization_id", (q) => q.eq("organizationId", args.organizationId))
        .collect();
    } else {
      return await ctx.db
        .query("kanbanBoards")
        .withIndex("by_owner_id", (q) => q.eq("ownerId", ownerId))
        .collect();
    }
  },
});

// Update task position
export const updateTaskPosition = mutation({
  args: {
    taskId: v.id("kanbanTasks"),
    columnId: v.id("kanbanColumns"),
    position: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const task = await ctx.db.get(args.taskId);
    if (!task) {
      throw new Error("Task not found");
    }

    const board = await ctx.db.get(task.boardId);
    if (!board) {
      throw new Error("Board not found");
    }

    // Check authorization
    if (board.ownerId !== identity.subject && board.organizationId) {
      // Organization check placeholder
      const hasAccess = true;
      if (!hasAccess) {
        throw new Error("Not authorized");
      }
    } else if (board.ownerId !== identity.subject) {
      throw new Error("Not authorized");
    }

    await ctx.db.patch(args.taskId, {
      columnId: args.columnId,
      position: args.position,
    });
  },
});

// Get all tasks for a board
export const getTasks = query({
  args: {
    boardId: v.id("kanbanBoards"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const board = await ctx.db.get(args.boardId);
    if (!board) {
      throw new Error("Board not found");
    }

    // Check authorization
    if (board.ownerId !== identity.subject && board.organizationId) {
      // Organization check placeholder
      const hasAccess = true;
      if (!hasAccess) {
        throw new Error("Not authorized");
      }
    } else if (board.ownerId !== identity.subject) {
      throw new Error("Not authorized");
    }

    return await ctx.db
      .query("kanbanTasks")
      .withIndex("by_board_id", (q) => q.eq("boardId", args.boardId))
      .collect();
  },
});

// Get all columns for a board
export const getColumns = query({
  args: {
    boardId: v.id("kanbanBoards"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const board = await ctx.db.get(args.boardId);
    if (!board) {
      throw new Error("Board not found");
    }

    // Check authorization
    if (board.ownerId !== identity.subject && board.organizationId) {
      // Organization check placeholder
      const hasAccess = true;
      if (!hasAccess) {
        throw new Error("Not authorized");
      }
    } else if (board.ownerId !== identity.subject) {
      throw new Error("Not authorized");
    }

    return await ctx.db
      .query("kanbanColumns")
      .withIndex("by_board_id", (q) => q.eq("boardId", args.boardId))
      .collect();
  },
}); 