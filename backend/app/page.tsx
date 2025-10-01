"use client";

import { trpc } from "@/lib/trpc";

export default function Home() {
  const helloQuery = trpc.hello.greet.useQuery();
  return <div>{helloQuery?.data}</div>;
}
