"use client";

import { trpc } from "@/lib/trpc";

export default function Home() {
  const { data, isLoading, error } = trpc.hello.greet.useQuery();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <div>{data}</div>;
}
