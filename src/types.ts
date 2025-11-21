import type { Nodes } from "mdast";

export type HeadingLevel = `h${1 | 2 | 3 | 4 | 5 | 6}`;

export interface ConverterOptions {
  olSeparator?: string;
  ulMarker?: string;
  imgMarker?: string;
  thematicBreak?: string;
  headingEmojis?: Record<HeadingLevel, string>;
}

export interface Context {
  options: Required<ConverterOptions>;
  indentLevel: number;
  handlers: Record<string, Handler>;
  joinSeparator?: string;
}

export type TraverseFn = (nodes: Nodes[], context: Context) => string;

export type Handler<T extends Nodes = Nodes> = (
  node: T,
  context: Context,
  traverse: TraverseFn,
) => string;

export type HandlersMap = Partial<Record<Nodes["type"], Handler>>;
