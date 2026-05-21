import { QueryCtx, MutationCtx } from "./_generated/server";

type messageContent = {
    type: "text" | "image" | "video" | "file";
    value: string;
    fileName?: string;
}

export const resolveMessageContent = async({ctx, content} : {ctx: QueryCtx | MutationCtx, content: messageContent[]}) => {
    return await Promise.all(content.map(async(item) => {
        if(item.type === 'text') {
            return item;
        }

        const url = await ctx.storage.getUrl(item.value);

        return {
            ...item,
            value: url || "",
        }
    }))
}