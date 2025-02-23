export function input(text: string) {
  const result = prompt(text);
  if (!result) throw new Error("No input provided");
  return result;
}
