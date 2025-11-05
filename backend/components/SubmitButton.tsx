import Button from "./Button";

interface SubmitButtonProps {
  isLoading: boolean;
  loadingText?: string;
  text: string;
  onClick: () => void;
  disabled?: boolean;
  defaultClassName?: string;
}

/**
 * A button component that handles loading states for form submissions
 * Automatically disables and shows loading text when isLoading is true
 */
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
