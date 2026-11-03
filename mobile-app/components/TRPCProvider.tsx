import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import React, { useState } from "react";
import { useAuth } from "@clerk/clerk-expo";
import { trpc } from "@/lib/trpc";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function TRPCProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { getToken } = useAuth();

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 2,
            staleTime: 5000,
          },
        },
      }),
  );
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: `${API_URL}/api/trpc`,
          async headers() {
            // Don't let a Clerk token failure block every API request.
            let authToken: string | null = null;
            try {
              authToken = await getToken();
            } catch (err) {
              console.warn("Could not get auth token:", err);
            }
            // Omit the header entirely when signed out: Expo's native fetch
            // rejects header values that aren't strings (e.g. undefined).
            return authToken ? { authorization: `Bearer ${authToken}` } : {};
          },
        }),
      ],
    }),
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
}
