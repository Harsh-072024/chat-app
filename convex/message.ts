import { ConvexError, v } from "convex/values";
import { mutation } from "./_generated/server";
import { getUserByClerkId } from "./_utils";

export const create = mutation({
  args: {
    conversationId: v.id("conversations"),
    content: v.array(
      v.object({
        type: v.union(
          v.literal("text"),
          v.literal("image"),
          v.literal("video"),
          v.literal("file"),
        ),
        value: v.string(),
        fileName: v.optional(v.string()),
        mimeType: v.optional(v.string()),
        size: v.optional(v.number()),
        thumbnail: v.optional(v.string()),
      }),
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorized");
    }

    const currentUser = await getUserByClerkId({
      ctx,
      clerkId: identity.subject,
    });

    if (!currentUser) {
      throw new ConvexError("User not found");
    }

    const memberShip = await ctx.db
      .query("conversationMembers")
      .withIndex("by_memberId_conversationId", (q) =>
        q
          .eq("memberId", currentUser._id)
          .eq("conversationId", args.conversationId),
      )
      .unique();

    if (!memberShip) {
      throw new ConvexError("You aren't a member of this conversation");
    }

    const message = await ctx.db.insert("messages", {
      senderId: currentUser._id,
      conversationId: args.conversationId,
      content: args.content,
    });

    await ctx.db.patch(args.conversationId, { lastMessageId: message });

    return message;
  },
});
