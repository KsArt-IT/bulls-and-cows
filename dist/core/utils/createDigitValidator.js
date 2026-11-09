import { DIGITS } from '../constants.js';
export const createDigitValidator = (base) => {
    const allowed = new Set(DIGITS.slice(0, base));
    return (char) => allowed.has(char.toLowerCase());
};
//# sourceMappingURL=createDigitValidator.js.map