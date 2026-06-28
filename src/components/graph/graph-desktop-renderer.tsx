"use client";

import { useEffect, useState, useRef } from "react";
import { GraphData } from "@/lib/graph";
import { GraphNode } from "./graph-node";
import { GraphEdge } from "./graph-edge";

interface GraphDesktopRendererProps {
  data: GraphData;
}

export function GraphDesktopRenderer({ data }: GraphDesktopRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  useEffect(() => {
    if (containerRef.current) {
      setDimensions({
        width: containerRef.current.clientWidth,
        height: containerRef.current.clientHeight,
      });
    }
  }, []);

  const centerX = dimensions.width / 2;
  const centerY = dimensions.height / 2;
  
  // Radial layout calculation
  const peripheralNodes = data.nodes.filter(n => !n.isCentral);
  const centralNode = data.nodes.find(n => n.isCentral);
  
  const radius = Math.min(dimensions.width, dimensions.height) * 0.35;
  const angleStep = (2 * Math.PI) / peripheralNodes.length;

  // Map to store calculated positions for edges
  const positions = new Map<string, { x: number, y: number }>();
  
  if (centralNode) {
    positions.set(centralNode.id, { x: centerX, y: centerY });
  }

  peripheralNodes.forEach((node, index) => {
    const angle = index * angleStep - Math.PI / 2; // Start from top
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    positions.set(node.id, { x, y });
  });

  return (
    <div 
      ref={containerRef} 
      className="relative w-full h-[600px] bg-muted/5 rounded-xl border border-border/50 overflow-hidden shadow-inner"
    >
      {/* Edges Layer */}
      {data.edges.map(edge => {
        const start = positions.get(edge.fromId);
        const end = positions.get(edge.toId);
        if (!start || !end) return null;
        
        return (
          <GraphEdge 
            key={edge.id}
            startX={start.x}
            startY={start.y}
            endX={end.x}
            endY={end.y}
            label={edge.label}
          />
        );
      })}

      {/* Nodes Layer */}
      {data.nodes.map(node => {
        const pos = positions.get(node.id);
        if (!pos) return null;
        
        return (
          <GraphNode 
            key={node.id}
            node={node}
            x={pos.x}
            y={pos.y}
          />
        );
      })}
    </div>
  );
}
