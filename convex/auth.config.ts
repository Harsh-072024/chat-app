import { AuthConfig } from "convex/server";

export default {
  providers: [
    {
      domain: "https://magnetic-husky-58.clerk.accounts.dev",
      applicationID: "convex",
    },
  ]
} satisfies AuthConfig;