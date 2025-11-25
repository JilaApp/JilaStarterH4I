import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "@/types/api";

export const trpc = createTRPCReact<AppRouter>();
