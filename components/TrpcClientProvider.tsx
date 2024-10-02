"use client";

import { getQueryClient, getUrl, trpc } from "@/trpc/client/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { useState } from "react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

interface TrpcClientProviderProps {
  children: React.ReactNode;
}

export const TrpcClientProvider = ({ children }: TrpcClientProviderProps) => {
  const [queryClient] = useState(getQueryClient());

  const [trpcClient] = useState(
    trpc.createClient({
      links: [
        httpBatchLink({
          url: getUrl(),
        }),
      ],
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </trpc.Provider>
  );
};
