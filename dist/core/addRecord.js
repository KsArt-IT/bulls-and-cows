const TOP_PER_GROUP = 3;
const groupKey = ({ base, length }) => `${base}:${length}`;
const compare = (a, b) => a.attempts - b.attempts || a.timeMs - b.timeMs;
export const addRecord = (records, record) => {
    const sorted = [...records, record].sort(compare);
    return sorted.filter((current, index) => sorted.slice(0, index).filter((better) => groupKey(better) === groupKey(current)).length <
        TOP_PER_GROUP);
};
//# sourceMappingURL=addRecord.js.map