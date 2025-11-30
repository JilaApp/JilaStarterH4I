export function useVideoLinks(
  links: string[],
  setLinks: (links: string[]) => void,
) {
  const handleLinkChange = (index: number, value: string) => {
    const newLinks = [...links];
    newLinks[index] = value;
    setLinks(newLinks);
  };

  const handleAddLink = () => {
    setLinks([...links, ""]);
  };

  const handleRemoveLink = (index: number) => {
    const newLinks = links.filter((_, i) => i !== index);
    setLinks(newLinks.length ? newLinks : [""]);
  };

  return { handleLinkChange, handleAddLink, handleRemoveLink };
}
