export const hasDuplicateDigits = (guess) => {
    const chars = [...guess.toLowerCase()];
    return new Set(chars).size !== chars.length;
};
//# sourceMappingURL=hasDuplicateDigits.js.map