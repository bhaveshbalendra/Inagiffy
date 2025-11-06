/**
 * Custom hook for exporting learning maps as JSON
 */
import { type LearningMap } from "../types";

export function useMapExport() {
  const exportMap = (learningMap: LearningMap) => {
    const dataStr = JSON.stringify(learningMap, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${learningMap.topic.replace(
      /\s+/g,
      "-"
    )}-learning-map.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return {
    exportMap,
  };
}
