import { availableLengths } from './availableLengths.js';
export const selectBase = (settings, base) => {
    const allowed = availableLengths(base);
    const length = allowed.includes(settings.length)
        ? settings.length
        : (allowed.at(-1) ?? settings.length);
    return { ...settings, base, length };
};
//# sourceMappingURL=selectBase.js.map