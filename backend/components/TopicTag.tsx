import { TOPIC_COLORS } from "@/lib/constants";
import type { TopicVariant } from "@/lib/types";

// Re-export for backward compatibility
export type { TopicVariant };

interface TopicTagProps {
  variant: TopicVariant;
}
export default function TopicTag({ variant }: TopicTagProps) {
  return (
    <div
      className={`flex items-center justify-center text-black-400 font-[500] p-[10px] min-w-[105px] w-fit h-[31px] rounded-[10px]`}
      style={{ backgroundColor: TOPIC_COLORS[variant] }}
    >
      {variant}
    </div>
  );
}
