/**
 * Interactive learning map visualization using ReactFlow
 */
import { Book, FileText, Video } from "lucide-react";
import { useMemo } from "react";
import ReactFlow, {
  Background,
  Controls,
  Handle,
  MiniMap,
  Position,
  type Edge,
  type Node,
  type NodeProps,
} from "reactflow";
import "reactflow/dist/style.css";
import { type LearningMap, type LearningResource } from "../types";

interface MapNodeData {
  label: string;
  description?: string;
  resources?: LearningResource[];
  type: "topic" | "branch" | "subtopic";
}

/**
 * Custom node component for displaying learning map nodes
 */
function MapNode({ data, selected }: NodeProps<MapNodeData>) {
  const getIcon = (type: string) => {
    switch (type) {
      case "topic":
        return "📚";
      case "branch":
        return "🌿";
      case "subtopic":
        return "📖";
      default:
        return "📝";
    }
  };

  return (
    <div
      className={`px-4 py-3 rounded-lg border-2 shadow-lg bg-white min-w-[200px] max-w-[300px] ${
        selected ? "border-primary" : "border-gray-200"
      }`}
    >
      <Handle type="target" position={Position.Top} />

      <div className="flex items-start gap-2">
        <span className="text-2xl">{getIcon(data.type)}</span>
        <div className="flex-1">
          <h3 className="font-semibold text-sm mb-1">{data.label}</h3>
          {data.description && (
            <p className="text-xs text-gray-600 mb-2 line-clamp-2">
              {data.description}
            </p>
          )}
          {data.resources && data.resources.length > 0 && (
            <div className="mt-2 space-y-1">
              <p className="text-xs font-medium text-gray-700">Resources:</p>
              {data.resources.slice(0, 2).map((resource, idx) => (
                <a
                  key={idx}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary hover:underline flex items-center gap-1"
                >
                  {resource.type === "article" && (
                    <FileText className="w-3 h-3" />
                  )}
                  {resource.type === "video" && <Video className="w-3 h-3" />}
                  {resource.type === "book" && <Book className="w-3 h-3" />}
                  {resource.title}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

const nodeTypes = {
  mapNode: MapNode,
};

/**
 * Converts learning map data to ReactFlow nodes and edges
 */
function convertMapToFlowData(learningMap: LearningMap): {
  nodes: Node<MapNodeData>[];
  edges: Edge[];
} {
  const nodes: Node<MapNodeData>[] = [];
  const edges: Edge[] = [];

  // Create root topic node
  const rootNodeId = "root";
  nodes.push({
    id: rootNodeId,
    type: "mapNode",
    position: { x: 400, y: 50 },
    data: {
      label: learningMap.topic,
      type: "topic",
    },
  });

  let currentY = 200;
  const branchSpacing = 250;
  const branchStartX = 100;

  // Create branch nodes and their subtopics
  learningMap.branches.forEach((branch, branchIndex) => {
    const branchNodeId = `branch-${branchIndex}`;
    const branchX = branchStartX + branchIndex * branchSpacing;

    nodes.push({
      id: branchNodeId,
      type: "mapNode",
      position: { x: branchX, y: currentY },
      data: {
        label: branch.title,
        description: branch.description,
        type: "branch",
      },
    });

    // Connect root to branch
    edges.push({
      id: `edge-${rootNodeId}-${branchNodeId}`,
      source: rootNodeId,
      target: branchNodeId,
      type: "smoothstep",
      animated: true,
    });

    // Create subtopic nodes
    branch.subtopics.forEach((subtopic, subtopicIndex) => {
      const subtopicNodeId = `subtopic-${branchIndex}-${subtopicIndex}`;
      const subtopicX = branchX;
      const subtopicY = currentY + 150 + subtopicIndex * 120;

      nodes.push({
        id: subtopicNodeId,
        type: "mapNode",
        position: { x: subtopicX, y: subtopicY },
        data: {
          label: subtopic.title,
          description: subtopic.description,
          resources: subtopic.resources,
          type: "subtopic",
        },
      });

      // Connect branch to subtopic
      edges.push({
        id: `edge-${branchNodeId}-${subtopicNodeId}`,
        source: branchNodeId,
        target: subtopicNodeId,
        type: "smoothstep",
      });
    });

    // Update currentY for next branch if needed
    const maxSubtopicY = currentY + 150 + branch.subtopics.length * 120;
    if (maxSubtopicY > currentY) {
      currentY = maxSubtopicY;
    }
  });

  return { nodes, edges };
}

interface LearningMapVisualizationProps {
  learningMap: LearningMap;
}

export function LearningMapVisualization({
  learningMap,
}: LearningMapVisualizationProps) {
  const { nodes, edges } = useMemo(
    () => convertMapToFlowData(learningMap),
    [learningMap]
  );

  return (
    <div className="w-full h-[600px] border rounded-lg bg-gray-50">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
}
