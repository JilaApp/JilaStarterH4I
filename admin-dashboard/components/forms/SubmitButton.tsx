import Button from "@/components/common/Button";

interface SubmitButtonProps {
  isLoading: boolean;
  loadingText?: string;
  text: string;
  onClick: () => void;
  disabled?: boolean;
  defaultClassName?: string;
}

export default function SubmitButton({
  isLoading,
  loadingText,
  text,
  onClick,
  disabled = false,
  defaultClassName = "",
}: SubmitButtonProps) {
  const buttonText = isLoading ? loadingText || "Submitting..." : text;
  const isDisabled = isLoading || disabled;

  const className = isDisabled
    ? `opacity-50 cursor-not-allowed ${defaultClassName}`
    : defaultClassName;

  return (
    <Button
      text={buttonText}
      onClick={onClick}
      disabled={isDisabled}
      defaultClassName={className}
    />
  );
}
