// Escaping
export const escapeText = (t: string) => t.replace(/[_*[\]()~`>#+\-=|{}.!]/g, "\\$&");
export const escapeCode = (t: string) => t.replace(/[`\\]/g, "\\$&");
export const escapeUrl = (t: string) => t.replace(/[)\\]/g, "\\$&");
