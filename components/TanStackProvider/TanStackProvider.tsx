"use client";

import { ReactNode, useState } from "react";
import {
  QueryClient,
  QueryClientProvider,
  HydrationBoundary,
  DehydratedState,
} from "@tanstack/react-query";

interface TanStackProviderProps {
  children: ReactNode;
  dehydratedState?: DehydratedState;
}

export default function TanStackProvider({
  children,
  dehydratedState,
}: TanStackProviderProps) {
  // Ініціалізація клієнта один раз на життєвий цикл компонента
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <HydrationBoundary state={dehydratedState}>{children}</HydrationBoundary>
    </QueryClientProvider>
  );
}
