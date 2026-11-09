import { addRecord } from './core/addRecord.js';
import { createGame } from './core/createGame.js';
import { makeGuess } from './core/makeGuess.js';
import { loadRecords, saveRecords } from './infra/storage.js';
import { toRecord } from './core/toRecord.js';
import { selectBase } from './core/utils/selectBase.js';
import { gameScreen } from './ui/gameScreen.js';
import { recordsView } from './ui/recordsView.js';
import { settingsScreen } from './ui/settingsScreen.js';
let screen = { kind: 'settings', settings: { length: 4, base: 10 } };
let records = loadRecords();
const renderSettings = (settings) => settingsScreen(settings, {
    onLength: (length) => update({ kind: 'settings', settings: { ...settings, length } }),
    onBase: (base) => update({ kind: 'settings', settings: selectBase(settings, base) }),
    onStart: () => update({ kind: 'game', game: createGame(settings, Date.now()) }),
});
const renderGame = (game) => gameScreen(game, {
    onGuess: (guess) => {
        const next = makeGuess(game, [...guess.toLowerCase()], Date.now());
        if (next === game)
            return;
        const record = toRecord(next);
        if (record) {
            records = addRecord(records, record);
            saveRecords(records);
        }
        update({ kind: 'game', game: next });
    },
    onNewGame: () => update({ kind: 'settings', settings: game.settings }),
});
const withRecords = (view) => {
    view.append(recordsView(records));
    return view;
};
const renderScreen = () => {
    if (screen.kind === 'settings')
        return withRecords(renderSettings(screen.settings));
    const view = renderGame(screen.game);
    return screen.game.status === 'won' ? withRecords(view) : view;
};
const render = () => {
    document.body.replaceChildren(renderScreen());
    document.querySelector('input')?.focus();
};
const update = (next) => {
    screen = next;
    render();
};
render();
//# sourceMappingURL=main.js.map