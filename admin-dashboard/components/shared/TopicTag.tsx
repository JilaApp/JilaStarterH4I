import { memo } from "react";
import { TOPIC_COLORS } from "@/lib/constants";
import type { TopicVariant } from "@/lib/types";

interface TopicTagProps {
  variant: TopicVariant;
}

const TopicTag = memo(function TopicTag({ variant }: TopicTagProps) {
  return (
    <div
      className={`flex items-center justify-center text-black-400 font-medium p-[10px] min-w-[105px] w-fit h-[31px] rounded-[10px]`}
      style={{ backgroundColor: TOPIC_COLORS[variant] }}
    >
      {variant}
    </div>
  );
});

export default TopicTag;
