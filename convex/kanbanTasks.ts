// import { ConvexError, v } from "convex/values";
// import { mutation } from "./_generated/server";

// export const createTask = mutation({
//   args: {
//     boardId: v.id("kanbanBoards"),
//     columnId: v.id("kanbanColumns"),
//     content: v.string(),
//   },
//   handler: async (ctx, args) => {
//     const user = await ctx.auth.getUserIdentity();
//     if (!user) throw new ConvexError("Unauthorized");

//     const lastTask = await ctx.db
//       .query("kanbanTasks")
//       .withIndex("by_column_id", q => q.eq("columnId", args.columnId))
//       .order("desc")
//       .first();

//     return await ctx.db.insert("kanbanTasks", {
//       boardId: args.boardId,
//       columnId: args.columnId,
//       content: args.content,
//       position: lastTask ? lastTask.position + 1 : 0,
//       ownerId: user.subject,
//     });
//   },
// });

// export const updateTask = mutation({
//   args: {
//     taskId: v.id("kanbanTasks"),
//     content: v.string(),
//   },
//   handler: async (ctx, args) => {
//     const user = await ctx.auth.getUserIdentity();
//     if (!user) throw new ConvexError("Unauthorized");

//     const task = await ctx.db.get(args.taskId);
//     if (!task) throw new ConvexError("Task not found");

//     if (task.ownerId !== user.subject) {
//       throw new ConvexError("Only the task owner can update it");
//     }

//     return await ctx.db.patch(args.taskId, {
//       content: args.content,
//     });
//   },
// });

// export const moveTask = mutation({
//   args: {
//     taskId: v.id("kanbanTasks"),
//     newColumnId: v.id("kanbanColumns"),
//     newPosition: v.number(),
//   },
//   handler: async (ctx, args) => {
//     const user = await ctx.auth.getUserIdentity();
//     if (!user) throw new ConvexError("Unauthorized");

//     const task = await ctx.db.get(args.taskId);
//     if (!task) throw new ConvexError("Task not found");

//     if (task.ownerId !== user.subject) {
//       throw new ConvexError("Only the task owner can move it");
//     }

//     return await ctx.db.patch(args.taskId, {
//       columnId: args.newColumnId,
//       position: args.newPosition,
//     });
//   },
// });

// export const deleteTask = mutation({
//   args: { taskId: v.id("kanbanTasks") },
//   handler: async (ctx, args) => {
//     const user = await ctx.auth.getUserIdentity();
//     if (!user) throw new ConvexError("Unauthorized");

//     const task = await ctx.db.get(args.taskId);
//     if (!task) throw new ConvexError("Task not found");

//     if (task.ownerId !== user.subject) {
//       throw new ConvexError("Only the task owner can delete it");
//     }

//     await ctx.db.delete(args.taskId);
//     return true;
//   },
// });

import { ConvexError, v } from "convex/values";
import { mutation } from "./_generated/server";

export const createTask = mutation({
  args: {
    boardId: v.id("kanbanBoards"),
    columnId: v.id("kanbanColumns"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) throw new ConvexError("Unauthorized");

    const lastTask = await ctx.db
      .query("kanbanTasks")
      .withIndex("by_column_id", q => q.eq("columnId", args.columnId))
      .order("desc")
      .first();

    return await ctx.db.insert("kanbanTasks", {
      boardId: args.boardId,
      columnId: args.columnId,
      content: args.content,
      position: lastTask ? lastTask.position + 1 : 0,
      ownerId: user.subject,
    });
  },
});

export const updateTask = mutation({
  args: {
    taskId: v.id("kanbanTasks"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) throw new ConvexError("Unauthorized");

    const task = await ctx.db.get(args.taskId);
    if (!task) throw new ConvexError("Task not found");

    if (task.ownerId !== user.subject) {
      throw new ConvexError("Only the task owner can update it");
    }

    return await ctx.db.patch(args.taskId, {
      content: args.content,
    });
  },
});

export const moveTask = mutation({
  args: {
    taskId: v.id("kanbanTasks"),
    newColumnId: v.id("kanbanColumns"),
    newPosition: v.number(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) throw new ConvexError("Unauthorized");

    const task = await ctx.db.get(args.taskId);
    if (!task) throw new ConvexError("Task not found");

    if (task.ownerId !== user.subject) {
      throw new ConvexError("Only the task owner can move it");
    }

    return await ctx.db.patch(args.taskId, {
      columnId: args.newColumnId,
      position: args.newPosition,
    });
  },
});

export const deleteTask = mutation({
  args: { taskId: v.id("kanbanTasks") },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) throw new ConvexError("Unauthorized");

    const task = await ctx.db.get(args.taskId);
    if (!task) throw new ConvexError("Task not found");

    if (task.ownerId !== user.subject) {
      throw new ConvexError("Only the task owner can delete it");
    }

    await ctx.db.delete(args.taskId);
    return true;
  },
});