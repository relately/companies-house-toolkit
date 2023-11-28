const knownAcronyms: Record<string, boolean> = {
  KPMG: true,
  'P.O.': true,
  PO: true,
  BOX: true,
};

// Will convert any word, ordinal or number followed by a single letter to title case
export const convertToTitleCase = (value: string): string =>
  value.replace(/\b([a-zA-Z']+|\d+(st|nd|rd|th)|\d+[a-zA-Z])\b/gi, (txt) =>
    knownAcronyms[txt]
      ? txt
      : txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase()
  );
