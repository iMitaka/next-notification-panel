import { QueryClient } from "@tanstack/react-query";
import { makeQueryClient } from "./makeQueryClient";

let clientQueryClientSingleton: QueryClient;

export const getQueryClient = () => {
  if (typeof window === "undefined") {
    return makeQueryClient();
  }

  return (clientQueryClientSingleton ??= makeQueryClient());
};
