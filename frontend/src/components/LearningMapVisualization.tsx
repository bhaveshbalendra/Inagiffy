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
      className={`px-4 py-3 rounded-lg border-2 shadow-lg bg-white min-w-[220px] max-w-[320px] z-10 ${
        selected ? "border-primary ring-2 ring-primary" : "border-gray-200"
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
 * Creates a vertical timeline layout with cards stacked vertically
 */
function convertMapToFlowData(learningMap: LearningMap): {
  nodes: Node<MapNodeData>[];
  edges: Edge[];
} {
  const nodes: Node<MapNodeData>[] = [];
  const edges: Edge[] = [];

  // Center X position for all nodes (vertical timeline)
  const centerX = 400;
  let currentY = 50;
  const verticalSpacing = 200; // Spacing between cards

  // Create root topic node at the top
  const rootNodeId = "root";
  nodes.push({
    id: rootNodeId,
    type: "mapNode",
    position: { x: centerX, y: currentY },
    data: {
      label: learningMap.topic,
      type: "topic",
    },
  });

  currentY += verticalSpacing;

  // Create branch nodes and their subtopics in vertical stack
  learningMap.branches.forEach((branch, branchIndex) => {
    const branchNodeId = `branch-${branchIndex}`;

    // Create branch node
    nodes.push({
      id: branchNodeId,
      type: "mapNode",
      position: { x: centerX, y: currentY },
      data: {
        label: branch.title,
        description: branch.description,
        type: "branch",
      },
    });

    // Connect root to first branch, or previous branch to current branch
    if (branchIndex === 0) {
      edges.push({
        id: `edge-${rootNodeId}-${branchNodeId}`,
        source: rootNodeId,
        target: branchNodeId,
        type: "straight",
        animated: true,
      });
    } else {
      const prevBranchNodeId = `branch-${branchIndex - 1}`;
      edges.push({
        id: `edge-${prevBranchNodeId}-${branchNodeId}`,
        source: prevBranchNodeId,
        target: branchNodeId,
        type: "straight",
        animated: true,
      });
    }

    currentY += verticalSpacing;

    // Create subtopic nodes for this branch
    branch.subtopics.forEach((subtopic, subtopicIndex) => {
      const subtopicNodeId = `subtopic-${branchIndex}-${subtopicIndex}`;

      nodes.push({
        id: subtopicNodeId,
        type: "mapNode",
        position: { x: centerX, y: currentY },
        data: {
          label: subtopic.title,
          description: subtopic.description,
          resources: subtopic.resources,
          type: "subtopic",
        },
      });

      // Connect branch to first subtopic, or previous subtopic to current subtopic
      if (subtopicIndex === 0) {
        edges.push({
          id: `edge-${branchNodeId}-${subtopicNodeId}`,
          source: branchNodeId,
          target: subtopicNodeId,
          type: "straight",
        });
      } else {
        const prevSubtopicNodeId = `subtopic-${branchIndex}-${
          subtopicIndex - 1
        }`;
        edges.push({
          id: `edge-${prevSubtopicNodeId}-${subtopicNodeId}`,
          source: prevSubtopicNodeId,
          target: subtopicNodeId,
          type: "straight",
        });
      }

      currentY += verticalSpacing;
    });
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
    <div className="w-full h-[800px] border rounded-lg bg-gray-50 overflow-hidden">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2, maxZoom: 1.2 }}
        minZoom={0.5}
        maxZoom={1.5}
        defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
}
