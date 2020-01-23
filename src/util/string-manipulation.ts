export function camalize(str: string) {
  if (str.length <= 1) return str;
  const camalized = str
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase());
  const camalizedUpperCase = `${camalized
    .charAt(0)
    .toUpperCase()}${camalized.slice(1)}`;
  return camalizedUpperCase;
}
