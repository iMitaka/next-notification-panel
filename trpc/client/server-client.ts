import { cache } from "react";
import { makeQueryClient } from "../utils/query-client";
import { appRouter } from "../server";
import { createCallerFactory } from "../server/server";
import { createHydrationHelpers } from "@trpc/react-query/rsc";

const getQueryClient = cache(makeQueryClient);
const caller = createCallerFactory(appRouter)({});

export const { trpc, HydrateClient } = createHydrationHelpers<typeof appRouter>(
  caller,
  getQueryClient
);
