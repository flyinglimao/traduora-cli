export default ({ env }: { env: NodeJS.ProcessEnv }) => ({
  baseUrl: env.TRADUORA_BASE_URL ?? "https://app.traduora.co",
  auth: {
    grantType: "client_credentials",
    clientId: env.TRADUORA_CLIENT_ID,
    clientSecret: env.TRADUORA_CLIENT_SECRET,
  },
});
