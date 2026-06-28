import Link from "next/link";
import { GraphNode as GraphNodeType } from "@/lib/graph";

interface GraphNodeProps {
  node: GraphNodeType;
  x: number;
  y: number;
}

export function GraphNode({ node, x, y }: GraphNodeProps) {
  return (
    <div 
      className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10 transition-transform hover:scale-110 hover:z-20"
      style={{ left: `${x}px`, top: `${y}px` }}
    >
      <Link href={`/entity/${node.slug}`} className="block outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-full">
        <div className={`
          flex flex-col items-center justify-center text-center p-3 rounded-full border shadow-xl backdrop-blur-sm
          transition-colors duration-300
          ${node.isCentral 
            ? 'w-32 h-32 bg-primary text-primary-foreground border-primary/50' 
            : 'w-24 h-24 bg-card/80 text-foreground border-border/80 hover:bg-accent hover:border-primary/50'
          }
        `}>
          <span className={`font-bold leading-tight ${node.isCentral ? 'text-lg' : 'text-xs'} line-clamp-2`}>
            {node.title}
          </span>
          {node.type && !node.isCentral && (
            <span className="text-[10px] opacity-70 mt-1 uppercase tracking-wider hidden sm:block">
              {node.type}
            </span>
          )}
        </div>
      </Link>
    </div>
  );
}
