"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        retry: (failureCount, error: any) => {
          if (error?.status === 401 || error?.message?.includes("Unauthorized")) {
            return false;
          }
          return failureCount < 3;
        }
      }
    }
  }));
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
