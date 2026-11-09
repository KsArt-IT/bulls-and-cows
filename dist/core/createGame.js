import { generateSecret } from './utils/generateSecret.js';
export const createGame = (settings, now, random = Math.random) => ({
    settings,
    secret: generateSecret(settings.length, settings.base, random),
    history: [],
    status: 'playing',
    startedAt: now,
    finishedAt: null,
});
//# sourceMappingURL=createGame.js.map