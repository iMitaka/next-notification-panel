import { initTRPC } from "@trpc/server";

const trpcServer = initTRPC.create();

export const router = trpcServer.router;
export const procedure = trpcServer.procedure;
export const createCallerFactory = trpcServer.createCallerFactory;
