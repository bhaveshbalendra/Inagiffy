/**
 * Main component for generating and displaying learning maps
 * Uses custom hooks for clean separation of concerns
 */
import { Download, Loader2 } from "lucide-react";
import { useLearningMapForm } from "../hooks/useLearningMapForm";
import { useMapExport } from "../hooks/useMapExport";
import { useMapGeneration } from "../hooks/useMapGeneration";
import { type LearningLevel } from "../types";
import { InlineError } from "./ErrorDisplay";
import { LearningMapVisualization } from "./LearningMapVisualization";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { FormError } from "./ui/form-error";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

export function MapGenerator() {
  const {
    topic,
    level,
    error,
    handleTopicChange,
    handleLevelChange,
    getFieldError,
    validateForm,
    clearFormError,
  } = useLearningMapForm();

  const { learningMap, isLoading, generateMap, resetMap } = useMapGeneration();
  const { exportMap } = useMapExport();

  const handleGenerate = async () => {
    resetMap();
    const validatedData = validateForm();
    if (!validatedData) return;

    try {
      await generateMap(validatedData);
    } catch {
      // Error already handled in useMapGeneration
    }
  };

  const handleExport = () => {
    if (!learningMap) return;
    exportMap(learningMap);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold">AI Learning Map Generator</h1>
        <p className="text-muted-foreground">
          Explore any topic visually with an AI-built interactive learning
          roadmap
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Generate Your Learning Map</CardTitle>
          <CardDescription>
            Enter a topic and select your learning level to generate an
            interactive learning map
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-4">
              <div className="flex gap-4 flex-col sm:flex-row">
                <div className="flex-1 space-y-1.5">
                  <Input
                    placeholder="Enter a topic (e.g., Machine Learning, Web Development, Quantum Physics)"
                    value={topic}
                    onChange={(e) => handleTopicChange(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !isLoading) {
                        handleGenerate();
                      }
                    }}
                    disabled={isLoading}
                    className={
                      getFieldError("topic")
                        ? "border-destructive focus-visible:ring-destructive"
                        : ""
                    }
                    aria-invalid={!!getFieldError("topic")}
                    aria-describedby={
                      getFieldError("topic") ? "topic-error" : undefined
                    }
                  />
                  <FormError
                    message={getFieldError("topic")}
                    className="text-xs"
                  />
                </div>
                <div className="space-y-1.5 sm:w-[200px]">
                  <Select
                    value={level}
                    onValueChange={(value) =>
                      handleLevelChange(value as LearningLevel)
                    }
                    disabled={isLoading}
                  >
                    <SelectTrigger
                      className={
                        getFieldError("level")
                          ? "border-destructive focus:ring-destructive"
                          : ""
                      }
                      aria-invalid={!!getFieldError("level")}
                    >
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Beginner">Beginner</SelectItem>
                      <SelectItem value="Intermediate">Intermediate</SelectItem>
                      <SelectItem value="Advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormError
                    message={getFieldError("level")}
                    className="text-xs"
                  />
                </div>
                <div className="flex items-end">
                  <Button
                    onClick={handleGenerate}
                    disabled={isLoading || !topic.trim()}
                    type="button"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      "Generate Learning Map"
                    )}
                  </Button>
                </div>
              </div>
            </div>

            {error && <InlineError error={error} onDismiss={clearFormError} />}
          </div>
        </CardContent>
      </Card>

      {isLoading && (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center space-y-4">
              <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
              <div className="space-y-2">
                <p className="text-muted-foreground">
                  Generating your learning map... This may take a moment.
                </p>
                <p className="text-sm text-muted-foreground/80">
                  Note: The backend service may be sleeping. Please wait up to
                  50 seconds for it to wake up. Because it is a free tier, it
                  may take a while to wake up.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {learningMap && !isLoading && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{learningMap.topic}</CardTitle>
                <CardDescription>
                  Level: {learningMap.level} • {learningMap.branches.length}{" "}
                  main branches
                </CardDescription>
              </div>
              <Button variant="outline" onClick={handleExport}>
                <Download className="mr-2 h-4 w-4" />
                Export JSON
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <LearningMapVisualization learningMap={learningMap} />
          </CardContent>
        </Card>
      )}

      {!learningMap && !isLoading && !error && (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center space-y-2">
              <p className="text-muted-foreground">
                Enter a topic above to generate your interactive learning map
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
