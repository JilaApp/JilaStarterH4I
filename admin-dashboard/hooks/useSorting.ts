import { useState } from "react";
import { SortConfig } from "@/lib/types";

export function useSorting() {
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);

  const handleSort = (key: string) => {
    setSortConfig((currentSort) => {
      if (!currentSort || currentSort.key !== key) {
        return { key, direction: "desc" };
      }
      return {
        key,
        direction: currentSort.direction === "desc" ? "asc" : "desc",
      };
    });
  };

  return { sortConfig, handleSort };
}
