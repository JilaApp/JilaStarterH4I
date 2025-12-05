export function formatDuration(duration: number) {
  const mins = Math.floor(duration / 60)
    .toString()
    .padStart(2, "0");
  const secs = (duration % 60).toString().padStart(2, "0");
  return `${mins}:${secs}`;
}
