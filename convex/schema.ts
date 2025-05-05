// Original antonio strucrture

// import { defineSchema, defineTable } from "convex/server";
// import { v } from "convex/values";

// export default defineSchema({
//     documents: defineTable({
//         title: v.string(),
//         initialContent: v.optional(v.string()),
//         ownerId: v.string(),
//         roomId: v.optional(v.string()),
//         organizationId: v.optional(v.string()),
//     })
//         .index("by_owner_id", ["ownerId"])
//         .index("by_organization_id", ["organizationId"])
//         .searchIndex("search_title", {
//             searchField: "title",
//             filterFields: ["ownerId", "organizationId"],
//         }) 
// });

import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  documents: defineTable({
    title: v.string(),
    initialContent: v.optional(v.string()),
    ownerId: v.string(),
    roomId: v.optional(v.string()),
    organizationId: v.optional(v.string()),
  })
    .index("by_owner_id", ["ownerId"])
    .index("by_organization_id", ["organizationId"])
    .searchIndex("search_title", {
      searchField: "title",
      filterFields: ["ownerId", "organizationId"],
    }),

  // Kanban Tables
    
  // kanbanBoards: defineTable({
  //   title: v.string(),
  //   ownerId: v.string(),
  //   organizationId: v.optional(v.string()),
  //   documentId: v.optional(v.id("documents")),
  // })
  //   .index("by_owner_id", ["ownerId"])
  //   .index("by_organization_id", ["organizationId"])
  //   .index("by_document_id", ["documentId"]),

  // kanbanColumns: defineTable({
  //   boardId: v.id("kanbanBoards"),
  //   title: v.string(),
  //   type: v.string(),
  //   order: v.number(),
  // })
  //   .index("by_board_id", ["boardId"]),

  // kanbanTasks: defineTable({
  //   columnId: v.id("kanbanColumns"),
  //   boardId: v.id("kanbanBoards"),
  //   content: v.string(),
  //   position: v.number(),
  //   ownerId: v.string(),
  // })
  //   .index("by_column_id", ["columnId"])
  //   .index("by_board_id", ["boardId"]),

notes: defineTable({
  documentId: v.optional(v.id("documents")),
  organizationId: v.optional(v.string()),
  heading: v.optional(v.string()),
  content: v.string(),
  color: v.string(),
  ownerId: v.string(),
  createdAt: v.number(),
  updatedAt: v.number(),
})
  .index("by_doc_owner", ["documentId", "ownerId"])
  .index("by_org_owner", ["organizationId", "ownerId"])
  .index("by_owner_created", ["ownerId", "createdAt"]),
   // Changed from by_creation_time,
  //  kanbanBoards: defineTable({
  //   documentId: v.id("documents"),
  //   columns: v.array(
  //     v.object({
  //       id: v.string(),
  //       title: v.string(),
  //       taskIds: v.array(v.string()),
  //     })
  //   ),
  //   tasks: v.array(
  //     v.object({
  //       id: v.string(),
  //       columnId: v.string(),
  //       content: v.string(),
  //       createdAt: v.number(),
  //       updatedAt: v.number(),
  //     })
  //   ),
  // }).index("by_document", ["documentId"]),

  kanbanBoards: defineTable({
    title: v.string(),
    ownerId: v.string(),
    organizationId: v.optional(v.string()),
    documentId: v.optional(v.id("documents")),
  })
    .index("by_owner_id", ["ownerId"])
    .index("by_organization_id", ["organizationId"])
    .index("by_document_id", ["documentId"]),

  kanbanColumns: defineTable({
    boardId: v.id("kanbanBoards"),
    title: v.string(),
    type: v.string(),
    order: v.number(),
  })
    .index("by_board_id", ["boardId"]),

  kanbanTasks: defineTable({
    columnId: v.id("kanbanColumns"),
    boardId: v.id("kanbanBoards"),
    content: v.string(),
    position: v.number(),
    ownerId: v.string(),
  })
    .index("by_column_id", ["columnId"])
    .index("by_board_id", ["boardId"]),
});