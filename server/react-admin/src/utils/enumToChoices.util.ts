export const enumToChoices = (enumObj: Record<string, string>) =>
  Object.entries(enumObj).map(([key, value]) => ({
    id: value,
    name: key.toLowerCase().replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
  }));
