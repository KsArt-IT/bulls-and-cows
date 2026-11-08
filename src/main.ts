import { addRecord } from './core/addRecord.js';
import { createGame } from './core/createGame.js';
import { makeGuess } from './core/makeGuess.js';
import { loadRecords, saveRecords } from './infra/storage.js';
import { toRecord } from './core/toRecord.js';
import type { GameState, Settings } from './core/types.js';
import { selectBase } from './core/utils/selectBase.js';
import { gameScreen } from './ui/gameScreen.js';
import { recordsView } from './ui/recordsView.js';
import { settingsScreen } from './ui/settingsScreen.js';

type Screen =
  | { readonly kind: 'settings'; readonly settings: Settings }
  | { readonly kind: 'game'; readonly game: GameState };

let screen: Screen = { kind: 'settings', settings: { length: 4, base: 10 } };

let records = loadRecords();

const renderSettings = (settings: Settings): HTMLElement =>
  settingsScreen(settings, {
    onLength: (length) => update({ kind: 'settings', settings: { ...settings, length } }),
    onBase: (base) => update({ kind: 'settings', settings: selectBase(settings, base) }),
    onStart: () => update({ kind: 'game', game: createGame(settings, Date.now()) }),
  });

const renderGame = (game: GameState): HTMLElement =>
  gameScreen(game, {
    onGuess: (guess) => {
      const next = makeGuess(game, [...guess.toLowerCase()], Date.now());
      if (next === game) return;
      const record = toRecord(next);
      if (record) {
        records = addRecord(records, record);
        saveRecords(records);
      }
      update({ kind: 'game', game: next });
    },
    onNewGame: () => update({ kind: 'settings', settings: game.settings }),
  });

const withRecords = (view: HTMLElement): HTMLElement => {
  view.append(recordsView(records));
  return view;
};

const renderScreen = (): HTMLElement => {
  if (screen.kind === 'settings') return withRecords(renderSettings(screen.settings));
  const view = renderGame(screen.game);
  return screen.game.status === 'won' ? withRecords(view) : view;
};

const render = (): void => {
  document.body.replaceChildren(renderScreen());
  document.querySelector('input')?.focus();
};

const update = (next: Screen): void => {
  screen = next;
  render();
};

render();
