export const toRecord = ({ settings, history, startedAt, finishedAt, }) => finishedAt === null
    ? null
    : { ...settings, attempts: history.length, timeMs: finishedAt - startedAt };
//# sourceMappingURL=toRecord.js.map