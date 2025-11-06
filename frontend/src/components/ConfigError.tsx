/**
 * Configuration error screen
 * Displays when app configuration is invalid or missing
 */
import { AlertCircle, FileText } from "lucide-react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

interface ConfigErrorProps {
  errors: string[];
}

export function ConfigError({ errors }: ConfigErrorProps) {
  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <Card className="max-w-2xl w-full border-destructive">
        <CardHeader>
          <div className="flex items-center gap-3">
            <AlertCircle className="h-8 w-8 text-destructive" />
            <div>
              <CardTitle className="text-destructive">
                Configuration Error
              </CardTitle>
              <CardDescription>
                The application cannot start due to missing or invalid
                configuration
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-semibold text-sm">
              Missing/Invalid Configuration:
            </h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              {errors.map((error, index) => (
                <li key={index} className="ml-2">
                  {error}
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t pt-4 space-y-3">
            <div className="flex items-start gap-3 p-3 bg-muted rounded-md">
              <FileText className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
              <div className="space-y-2 text-sm">
                <p className="font-medium">How to fix:</p>
                <ol className="list-decimal list-inside space-y-1 text-muted-foreground ml-2">
                  <li>
                    Create a{" "}
                    <code className="bg-background px-1 py-0.5 rounded">
                      .env
                    </code>{" "}
                    file in the frontend directory
                  </li>
                  <li>
                    Add the required environment variables:
                    <pre className="mt-2 p-2 bg-background rounded text-xs overflow-x-auto">
                      {errors
                        .filter((error) => error.includes("("))
                        .map((error) => {
                          const match = error.match(/\(([^)]+)\)/);
                          return match ? `${match[1]}=your_value_here` : null;
                        })
                        .filter(Boolean)
                        .join("\n") ||
                        "VITE_API_URL=http://localhost:8000/api/v1"}
                    </pre>
                  </li>
                  <li>Restart the development server</li>
                </ol>
              </div>
            </div>

            <Button onClick={handleReload} variant="outline" className="w-full">
              Reload Page
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
