import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createBoard = mutation({
  args: { title: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) throw new ConvexError("Unauthorized");

    const organizationId = user.organization_id ? String(user.organization_id) : undefined;
    
    const boardId = await ctx.db.insert("kanbanBoards", {
      title: args.title,
      ownerId: user.subject,
      organizationId,
    });

    const defaultColumns = [
      { title: "Todo", type: "todo", order: 0 },
      { title: "In Progress", type: "inProgress", order: 1 },
      { title: "Review", type: "review", order: 2 },
      { title: "Done", type: "done", order: 3 },
    ];

    for (const column of defaultColumns) {
      await ctx.db.insert("kanbanColumns", {
        boardId,
        ...column,
      });
    }

    return boardId;
  },
});

export const getBoard = query({
  args: { boardId: v.id("kanbanBoards") },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) throw new ConvexError("Unauthorized");

    const board = await ctx.db.get(args.boardId);
    if (!board) throw new ConvexError("Board not found");

    const isOwner = board.ownerId === user.subject;
    const isOrganizationMember = board.organizationId && board.organizationId === user.organization_id;
    if (!isOwner && !isOrganizationMember) throw new ConvexError("Unauthorized");

    const columns = await ctx.db
      .query("kanbanColumns")
      .withIndex("by_board_id", q => q.eq("boardId", args.boardId))
      .order("asc")
      .collect();

    const boardData = await Promise.all(columns.map(async column => {
      const tasks = await ctx.db
        .query("kanbanTasks")
        .withIndex("by_column_id", q => q.eq("columnId", column._id))
        .order("asc")
        .collect();

      return {
        ...column,
        tasks,
      };
    }));

    return {
      ...board,
      columns: boardData,
    };
  },
});

export const deleteBoard = mutation({
  args: { boardId: v.id("kanbanBoards") },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) throw new ConvexError("Unauthorized");

    const board = await ctx.db.get(args.boardId);
    if (!board) throw new ConvexError("Board not found");

    if (board.ownerId !== user.subject) {
      throw new ConvexError("Only the owner can delete this board");
    }

    // Delete all tasks and columns first
    const columns = await ctx.db
      .query("kanbanColumns")
      .withIndex("by_board_id", q => q.eq("boardId", args.boardId))
      .collect();

    for (const column of columns) {
      const tasks = await ctx.db
        .query("kanbanTasks")
        .withIndex("by_column_id", q => q.eq("columnId", column._id))
        .collect();

      for (const task of tasks) {
        await ctx.db.delete(task._id);
      }
      await ctx.db.delete(column._id);
    }

    await ctx.db.delete(args.boardId);
    return true;
  },
});
