// import { ConvexError, v } from "convex/values";
// import { mutation, query } from "./_generated/server";

// export const create = mutation({
//   args: {
//     heading: v.optional(v.string()),
//     content: v.string(),
//     color: v.string(),
//     documentId: v.optional(v.id("documents")),
//   },
//   handler: async (ctx, args) => {
//     const user = await ctx.auth.getUserIdentity();
//     if (!user) throw new ConvexError("Unauthorized");

//     const organizationId = user.organization_id ? String(user.organization_id) : undefined;

//     return await ctx.db.insert("notes", {
//       heading: args.heading,
//       content: args.content,
//       color: args.color,
//       ownerId: user.subject,
//       documentId: args.documentId,
//       organizationId, // Include organizationId if it exists
//     });
//   },
// });

// export const get = query({
//   args: {
//     documentId: v.optional(v.id("documents")),
//   },
//   handler: async (ctx, args) => {
//     const user = await ctx.auth.getUserIdentity();
//     if (!user) throw new ConvexError("Unauthorized");

//     const organizationId = user.organization_id ? String(user.organization_id) : undefined;

//     if (args.documentId) {
//       return await ctx.db
//         .query("notes")
//         .withIndex("by_owner_document", q => 
//           q.eq("ownerId", user.subject)
//            .eq("documentId", args.documentId)
//         )
//         .collect();
//     }

//     // Get all personal notes (both with and without organization)
//     return await ctx.db
//       .query("notes")
//       .withIndex("by_owner_id", q => q.eq("ownerId", user.subject))
//       .filter(q => 
//         q.or(
//           q.eq(q.field("documentId"), undefined),
//           q.eq(q.field("organizationId"), organizationId)
//         )
//       )
//       .collect();
//   },
// });

// export const update = mutation({
//   args: {
//     id: v.id("notes"),
//     heading: v.optional(v.string()),
//     content: v.string(),
//   },
//   handler: async (ctx, args) => {
//     const user = await ctx.auth.getUserIdentity();
//     if (!user) throw new ConvexError("Unauthorized");

//     const note = await ctx.db.get(args.id);
//     if (!note) throw new ConvexError("Note not found");
//     if (note.ownerId !== user.subject) {
//       throw new ConvexError("Only the note owner can update it");
//     }

//     return await ctx.db.patch(args.id, {
//       heading: args.heading,
//       content: args.content,
//     });
//   },
// });

// export const remove = mutation({
//   args: { id: v.id("notes") },
//   handler: async (ctx, args) => {
//     const user = await ctx.auth.getUserIdentity();
//     if (!user) throw new ConvexError("Unauthorized");

//     const note = await ctx.db.get(args.id);
//     if (!note) throw new ConvexError("Note not found");
//     if (note.ownerId !== user.subject) {
//       throw new ConvexError("Only the note owner can delete it");
//     }

//     await ctx.db.delete(args.id);
//     return true;
//   },
// });

import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createDocumentNote = mutation({
  args: {
    documentId: v.id("documents"),
    heading: v.optional(v.string()),
    content: v.string(),
    color: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) throw new ConvexError("Unauthorized");

    const document = await ctx.db.get(args.documentId);
    if (!document) throw new ConvexError("Document not found");

    const now = Date.now();
    return await ctx.db.insert("notes", {
      documentId: args.documentId,
      organizationId: document.organizationId,
      heading: args.heading,
      content: args.content,
      color: args.color,
      ownerId: user.subject,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const createOrganizationNote = mutation({
  args: {
    heading: v.optional(v.string()),
    content: v.string(),
    color: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) throw new ConvexError("Unauthorized");
    if (!user.organization_id) throw new ConvexError("Organization required");

    const now = Date.now();
    return await ctx.db.insert("notes", {
      organizationId: String(user.organization_id),
      heading: args.heading,
      content: args.content,
      color: args.color,
      ownerId: user.subject,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const getDocumentNotes = query({
  args: {
    documentId: v.id("documents"),
  },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) throw new ConvexError("Unauthorized");

    return await ctx.db
      .query("notes")
      .withIndex("by_doc_owner", q => 
        q.eq("documentId", args.documentId)
         .eq("ownerId", user.subject)
      )
      .order("desc")
      .collect();
  },
});

export const getOrganizationNotes = query({
  handler: async (ctx) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) throw new ConvexError("Unauthorized");
    if (!user.organization_id) return [];

    return await ctx.db
      .query("notes")
      .withIndex("by_org_owner", q => 
        q.eq("organizationId", String(user.organization_id))
         .eq("ownerId", user.subject)
      )
      .filter(q => q.eq(q.field("documentId"), undefined))
      .order("desc")
      .collect();
  },
});

export const updateNote = mutation({
  args: {
    id: v.id("notes"),
    heading: v.optional(v.string()),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) throw new ConvexError("Unauthorized");

    const note = await ctx.db.get(args.id);
    if (!note) throw new ConvexError("Note not found");
    if (note.ownerId !== user.subject) {
      throw new ConvexError("Only the note owner can update it");
    }

    return await ctx.db.patch(args.id, {
      heading: args.heading,
      content: args.content,
      updatedAt: Date.now(),
    });
  },
});

export const deleteNote = mutation({
  args: { id: v.id("notes") },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) throw new ConvexError("Unauthorized");

    const note = await ctx.db.get(args.id);
    if (!note) throw new ConvexError("Note not found");
    if (note.ownerId !== user.subject) {
      throw new ConvexError("Only the note owner can delete it");
    }

    await ctx.db.delete(args.id);
    return true;
  },
});