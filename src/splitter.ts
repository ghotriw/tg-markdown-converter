import type { Nodes } from "mdast";
import type { Context, TraverseFn } from "./types.ts";
import { splitStrategies } from "./strategies.ts";

export function splitNodes(
  nodes: Nodes[],
  ctx: Context,
  traverse: TraverseFn,
  limit: number,
): string[] {
  const chunks: string[] = [];
  let currentChunk = "";

  for (const node of nodes) {
    // We try to render the entire node
    const blockText = traverse([node], ctx);
    if (!blockText) continue;

    const separator = currentChunk.length > 0 ? "\n\n" : "";

    // If the node FITS into the current chunk
    if (currentChunk.length + separator.length + blockText.length <= limit) {
      currentChunk += separator + blockText;
      continue;
    }

    // If the node does NOT fit into the current one, but fits into a NEW empty chunk
    if (blockText.length <= limit) {
      if (currentChunk.length > 0) chunks.push(currentChunk);
      currentChunk = blockText;
      continue;
    }

    // CASE: HUGE NODE (The node is larger than the limit even on its own). Flushing the buffer
    if (currentChunk.length > 0) {
      chunks.push(currentChunk);
      currentChunk = "";
    }

    const strategy = splitStrategies[node.type];

    if (strategy) {
      // If there is a strategy, ask it to split the node into "atomic" chunks.
      // Note: the strategy may return an array where the elements are still large,
      // but for simplicity, we assume the strategy tries to adhere to the limit (as in code)
      // or splits into logical parts (as in blockquote).
      const parts = strategy(node, ctx, traverse, limit);

      if (parts.length > 0) {
        // Now let's try to pack these parts as regular nodes
        // Recursively pack the parts (in case parts[0] + parts[1] fit into one message)
        for (const part of parts) {
          const partSep = currentChunk.length > 0 ? "\n\n" : "";

          if (currentChunk.length + partSep.length + part.length <= limit) {
            currentChunk += partSep + part;
          } else {
            if (currentChunk.length > 0) chunks.push(currentChunk);
            // If the part itself is greater than the limit (and the strategy failed), we push as is
            if (part.length > limit) {
              chunks.push(part);
              currentChunk = "";
            } else {
              currentChunk = part;
            }
          }
        }
      } else {
        // The strategy returned a void (couldn't break it) -> push it entirely
        chunks.push(blockText);
      }
    } else {
      // No strategy -> push in full
      chunks.push(blockText);
    }
  }

  if (currentChunk) chunks.push(currentChunk);

  return chunks;
}
