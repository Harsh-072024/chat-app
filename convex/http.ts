import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { WebhookEvent } from "@clerk/nextjs/server";
import { Webhook } from "svix";
import { internal } from "./_generated/api";

const validatePayload = async (
  req: Request
): Promise<WebhookEvent | undefined> => {
  const payload = await req.text();

  const svixHeaders = {
    "svix-id": req.headers.get("svix-id")!,
    "svix-timestamp": req.headers.get("svix-timestamp")!,
    "svix-signature": req.headers.get("svix-signature")!,
  };

  const webhook = new Webhook(process.env.CLERK_WEBHOOK_SECRET || "");

  try {
    const event = webhook.verify(payload, svixHeaders) as WebhookEvent;

    return event;
  } catch (error) {
    console.error("Clerk webhook request could not be verified");
    return;
  }
};

const handlerClerkWebhook = httpAction(async (ctx, req) => {
  const event = await validatePayload(req);

  if (!event) {
    return new Response("Could not validate clerk payload", {
      status: 400,
    });
  }

  console.log("🔥 Clerk Webhook Event:", event.type, event.data.id);

  if (event.type === "user.created" || event.type === "user.updated") {
    const existingUser = await ctx.runQuery(internal.user.get, {
      clerkId: event.data.id,
    });

    const payload = {
      clerkId: event.data.id,
      username: `${event.data.first_name} ${event.data.last_name}`,
      imageUrl: event.data.image_url,
      email: event.data.email_addresses[0].email_address,
    };

    if (existingUser) {
      await ctx.runMutation(internal.user.update, payload);
    } else {
      await ctx.runMutation(internal.user.create, payload);
    }
  } else {
    console.log("Clerk webhook event not supported", event.type);
  }

  return new Response(null, {
    status: 200,
  });
});

const http = httpRouter();

http.route({
  path: "/clerk-users-webhook",
  method: "POST",
  handler: handlerClerkWebhook,
});

export default http;
