const topicColors = {
  Career: "#CDE6B9",
  Legal: "#D4928F",
  Medical: "#FBE2B6",
  Transport: "#BDD0E2",
  Other: "#F3CAAD",
  Shelters: "#FBE2B6",
  Food: "#CDE6B9",
  Emergencia: "#D4928F",
  Transportation: "#BDD0E2",
};

export type TopicVariant = keyof typeof topicColors;

interface TopicTagProps {
  variant: TopicVariant;
}
export default function TopicTag({ variant }: TopicTagProps) {
  return (
    <div
      className={`flex items-center justify-center text-black-400 font-[500] p-[10px] min-w-[105px] w-fit h-[31px] rounded-[10px]`}
      style={{ backgroundColor: topicColors[variant] }}
    >
      {variant}
    </div>
  );
}
