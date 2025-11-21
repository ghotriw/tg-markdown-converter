import type { Nodes } from "mdast";

/**
 * Represents the valid heading levels in Markdown (h1 through h6).
 */
export type HeadingLevel = `h${1 | 2 | 3 | 4 | 5 | 6}`;

/**
 * Defines optional settings to customize the MarkdownV2 output markers.
 */
export interface ConverterOptions {
  olSeparator?: string;
  ulMarker?: string;
  imgMarker?: string;
  thematicBreak?: string;
  headingEmojis?: Record<HeadingLevel, string>;
}

/**
 * Defines the current state of the conversion process during AST traversal.
 */
export interface Context {
  options: Required<ConverterOptions>;
  indentLevel: number;
  handlers: Record<string, Handler>;
  joinSeparator?: string;
}

/**
 * A function type used for recursively traversing the Abstract Syntax Tree (AST).
 * * It takes an array of nodes and the current context, and returns the converted MarkdownV2 string.
 *
 * @param nodes The array of MD AST nodes (children) to process.
 * @param context The current traversal context, including options and handlers.
 * @returns The converted MarkdownV2 string segment.
 */
export type TraverseFn = (nodes: Nodes[], context: Context) => string;

/**
 * Defines the signature for a function that converts a specific AST node type.
 * * Handlers are responsible for rendering their specific node and recursively calling
 * the traverse function for any children.
 *
 * @template T The specific MD AST node type this handler is designed to process (e.g., 'paragraph', 'link').
 * @param node The current MD AST node being processed.
 * @param context The current state of the traversal (options, indentation level, handlers).
 * @param traverse The recursive traversal function to process child nodes.
 * @returns The converted MarkdownV2 string segment for this node.
 */
export type Handler<T extends Nodes = Nodes> = (
  node: T,
  context: Context,
  traverse: TraverseFn,
) => string;

/**
 * A map containing custom functions (Handlers) to override the default conversion logic
 * for specific Markdown AST node types (e.g., 'code', 'link', 'blockquote').
 */
export type HandlersMap = Partial<Record<Nodes["type"], Handler>>;
