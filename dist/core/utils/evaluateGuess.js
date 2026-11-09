const normalize = (digits) => digits.map((digit) => digit.toLowerCase());
export const evaluateGuess = (secret, guess) => {
    const secretDigits = normalize(secret);
    const guessDigits = normalize(guess);
    const secretSet = new Set(secretDigits);
    const bulls = guessDigits.filter((digit, i) => digit === secretDigits[i]).length;
    const matches = guessDigits.filter((digit) => secretSet.has(digit)).length;
    return { bulls, cows: matches - bulls };
};
//# sourceMappingURL=evaluateGuess.js.map