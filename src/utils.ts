// Escaping
export const escapeText = (t: string) => t.replace(/[_*[\]()~`>#+\-=|{}.!]/g, "\\$&");
export const escapeCode = (t: string) => t.replace(/[`\\]/g, "\\$&");
export const escapeUrl = (t: string) => t.replace(/[()\\]/g, "\\$&");

/**
 * Splits a string into chunks of a specific size.
 */
export function chunkString(str: string, size: number): string[] {
  const numChunks = Math.ceil(str.length / size);
  const chunks = new Array(numChunks);

  for (let i = 0, o = 0; i < numChunks; ++i, o += size) {
    chunks[i] = str.slice(o, o + size);
  }

  return chunks;
}
