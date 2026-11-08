export const hasDuplicateDigits = (guess: string): boolean => {
  const chars = [...guess.toLowerCase()];
  return new Set(chars).size !== chars.length;
};
