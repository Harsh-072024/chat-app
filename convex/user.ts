import { ConvexError, v } from "convex/values";
import { internalMutation, internalQuery } from "./_generated/server";

export const create = internalMutation({
  args: {
    username: v.string(),
    imageUrl: v.string(),
    clerkId: v.string(),
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .first();

    // 2️⃣ If exists → return it (DO NOT insert)
    if (existingUser) {
      return existingUser;
    }

    // 3️⃣ Else → insert new user
    return await ctx.db.insert("users", args);
  },
});

export const update = internalMutation({
  args: {
    username: v.string(),
    imageUrl: v.string(),
    clerkId: v.string(),
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId)).unique();

    if (!existingUser) {
      throw new ConvexError("User not found")
    };
    
    return await ctx.db.patch(existingUser._id,{
      username: args.username,
      imageUrl: args.imageUrl,
      email: args.email,
    })
  },
});

export const get = internalQuery({
  args: { clerkId: v.string() },
  async handler(ctx, args) {
    return ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .unique();
  },
});
