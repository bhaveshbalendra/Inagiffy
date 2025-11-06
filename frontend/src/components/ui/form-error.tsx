/**
 * Form field error display component
 */
import { AlertCircle } from "lucide-react";
import { cn } from "../../lib/utils";

interface FormErrorProps {
  message?: string;
  className?: string;
}

export function FormError({ message, className }: FormErrorProps) {
  if (!message) return null;

  return (
    <div
      className={cn(
        "flex items-center gap-1.5 text-sm text-destructive mt-1.5",
        className
      )}
    >
      <AlertCircle className="h-3.5 w-3.5 shrink-0" />
      <span>{message}</span>
    </div>
  );
}
