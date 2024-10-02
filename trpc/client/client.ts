import { createTRPCReact } from "@trpc/react-query";
import { AppRouter } from "../server/index";
import { QueryClient } from "@tanstack/react-query";
import { makeQueryClient } from "../utils/query-client";

export const trpc = createTRPCReact<AppRouter>({});

let clientQueryClientSingleton: QueryClient;

export const getQueryClient = () => {
  if (typeof window === "undefined") {
    return makeQueryClient();
  }

  return (clientQueryClientSingleton ??= makeQueryClient());
};

export const getUrl = () => {
  const base = (() => {
    if (typeof window !== "undefined") return "";
    if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
    return "http://localhost:3000";
  })();
  
  return `${base}/api/trpc`;
};
