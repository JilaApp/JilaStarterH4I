import { AlertCircle } from "lucide-react";

interface FormErrorProps {
  message: string;
}

export default function FormError({ message }: FormErrorProps) {
  return (
    <div className="rounded-lg bg-error-200 p-4 flex items-start gap-2">
      <AlertCircle className="w-5 h-5 text-error-400 flex-shrink-0 mt-0.5" />
      <p className="text-error-400 font-normal text-[14px] leading-[20px]">
        {message}
      </p>
    </div>
  );
}
