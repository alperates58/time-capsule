import { getEntityBySlug, getEntityRelations } from "./timecapsule";

export interface GraphNode {
  id: string;
  slug: string;
  title: string;
  type: string | null;
  isCentral?: boolean;
}

export interface GraphEdge {
  id: string;
  fromId: string;
  toId: string;
  label: string;
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

/**
 * Gets a 1-degree depth graph around a central entity.
 */
export async function getEntityGraph(slug: string): Promise<GraphData | null> {
  const centralEntity = await getEntityBySlug(slug);
  if (!centralEntity) return null;

  const { fromRelations, toRelations } = await getEntityRelations(centralEntity.id);

  const nodesMap = new Map<string, GraphNode>();
  const edges: GraphEdge[] = [];

  // Add central node
  nodesMap.set(centralEntity.id, {
    id: centralEntity.id,
    slug: centralEntity.slug,
    title: centralEntity.title,
    type: centralEntity.type,
    isCentral: true,
  });

  // Process outgoing relations (Current -> Target)
  for (const rel of fromRelations) {
    const target = rel.toEntity;
    if (!nodesMap.has(target.id)) {
      nodesMap.set(target.id, {
        id: target.id,
        slug: target.slug,
        title: target.title,
        type: target.type,
        isCentral: false,
      });
    }
    edges.push({
      id: rel.id,
      fromId: centralEntity.id,
      toId: target.id,
      label: rel.relationType,
    });
  }

  // Process incoming relations (Source -> Current)
  for (const rel of toRelations) {
    const source = rel.fromEntity;
    if (!nodesMap.has(source.id)) {
      nodesMap.set(source.id, {
        id: source.id,
        slug: source.slug,
        title: source.title,
        type: source.type,
        isCentral: false,
      });
    }
    edges.push({
      id: rel.id,
      fromId: source.id,
      toId: centralEntity.id,
      label: rel.relationType,
    });
  }

  return {
    nodes: Array.from(nodesMap.values()),
    edges,
  };
}
