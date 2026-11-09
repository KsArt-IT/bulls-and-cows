import { addRecord } from '../core/addRecord.js';
import { SUPPORTED_BASES, SUPPORTED_LENGTHS } from '../core/constants.js';
const STORAGE_KEY = 'bulls-and-cows-game:leaderboard:v1';
const isGameRecord = (value) => {
    if (typeof value !== 'object' || value === null)
        return false;
    const { length, base, attempts, timeMs } = value;
    return (SUPPORTED_LENGTHS.some((l) => l === length) &&
        SUPPORTED_BASES.some((b) => b === base) &&
        typeof length === 'number' &&
        typeof base === 'number' &&
        length <= base &&
        Number.isInteger(attempts) &&
        attempts > 0 &&
        typeof timeMs === 'number' &&
        Number.isFinite(timeMs) &&
        timeMs >= 0);
};
export const loadRecords = (storage = localStorage) => {
    try {
        const parsed = JSON.parse(storage.getItem(STORAGE_KEY) ?? '[]');
        return Array.isArray(parsed)
            ? parsed.filter(isGameRecord).reduce(addRecord, [])
            : [];
    }
    catch {
        return [];
    }
};
export const saveRecords = (records, storage = localStorage) => {
    try {
        storage.setItem(STORAGE_KEY, JSON.stringify(records));
    }
    catch {
        // storage is full or unavailable (private mode) — the game still works without records
    }
};
//# sourceMappingURL=storage.js.map