interface GraphEdgeProps {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  label: string;
}

export function GraphEdge({ startX, startY, endX, endY, label }: GraphEdgeProps) {
  // Calculate line length and angle
  const dx = endX - startX;
  const dy = endY - startY;
  const length = Math.sqrt(dx * dx + dy * dy);
  const angle = Math.atan2(dy, dx) * (180 / Math.PI);
  
  // Find center point for label
  const midX = startX + dx / 2;
  const midY = startY + dy / 2;

  return (
    <>
      {/* The visible line */}
      <div 
        className="absolute bg-border/50 h-px origin-left z-0"
        style={{
          left: `${startX}px`,
          top: `${startY}px`,
          width: `${length}px`,
          transform: `rotate(${angle}deg)`,
        }}
      />
      {/* The relationship label */}
      <div 
        className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none"
        style={{ left: `${midX}px`, top: `${midY}px` }}
      >
        <span className="bg-background/80 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] font-medium text-muted-foreground uppercase tracking-wider border border-border/40 whitespace-nowrap">
          {label.replace(/_/g, ' ')}
        </span>
      </div>
    </>
  );
}
