/**
 * Reusable error display component
 * Displays errors in a consistent, user-friendly way
 */
import { AlertCircle, X } from "lucide-react";
import { getErrorMessage } from "../utils/errorHandler";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

interface ErrorDisplayProps {
  error: unknown;
  onDismiss?: () => void;
  title?: string;
  className?: string;
}

export function ErrorDisplay({
  error,
  onDismiss,
  title = "Error",
  className = "",
}: ErrorDisplayProps) {
  const errorMessage = getErrorMessage(error);

  return (
    <Card className={`border-destructive ${className}`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-semibold text-destructive mb-1">{title}</h4>
            <p className="text-sm text-muted-foreground">{errorMessage}</p>
          </div>
          {onDismiss && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onDismiss}
              className="h-6 w-6 shrink-0"
              aria-label="Dismiss error"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface InlineErrorProps {
  error: unknown;
  onDismiss?: () => void;
  className?: string;
}

export function InlineError({
  error,
  onDismiss,
  className = "",
}: InlineErrorProps) {
  const errorMessage = getErrorMessage(error);

  return (
    <div
      className={`flex items-center gap-2 p-4 bg-destructive/10 text-destructive rounded-md ${className}`}
    >
      <AlertCircle className="h-5 w-5 shrink-0" />
      <p className="flex-1 text-sm">{errorMessage}</p>
      {onDismiss && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onDismiss}
          className="h-6 w-6 shrink-0"
          aria-label="Dismiss error"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
