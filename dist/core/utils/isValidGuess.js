import { createDigitValidator } from './createDigitValidator.js';
import { hasDuplicateDigits } from './hasDuplicateDigits.js';
export const isValidGuess = (guess, length, base) => {
    const isDigit = createDigitValidator(base);
    const chars = [...guess.toLowerCase()];
    return chars.length === length && chars.every(isDigit) && !hasDuplicateDigits(guess);
};
//# sourceMappingURL=isValidGuess.js.map