import { DIGITS } from '../constants.js';
export const generateSecret = (length, base, random = Math.random) => Array.from({ length }).reduce(({ pool, secret }) => {
    const index = Math.floor(random() * pool.length);
    return {
        pool: pool.filter((_, i) => i !== index),
        secret: [...secret, pool[index]],
    };
}, { pool: [...DIGITS.slice(0, base)], secret: [] }).secret;
//# sourceMappingURL=generateSecret.js.map