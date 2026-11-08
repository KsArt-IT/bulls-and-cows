import { createGame } from './core/createGame.js';
import { makeGuess } from './core/makeGuess.js';
import type { GameState, Settings } from './core/types.js';
import { selectBase } from './core/utils/selectBase.js';
import { gameScreen } from './ui/gameScreen.js';
import { settingsScreen } from './ui/settingsScreen.js';

type Screen =
  | { readonly kind: 'settings'; readonly settings: Settings }
  | { readonly kind: 'game'; readonly game: GameState };

let screen: Screen = { kind: 'settings', settings: { length: 4, base: 10 } };

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
      if (next !== game) update({ kind: 'game', game: next });
    },
    onNewGame: () => update({ kind: 'settings', settings: game.settings }),
  });

const render = (): void => {
  document.body.replaceChildren(
    screen.kind === 'settings' ? renderSettings(screen.settings) : renderGame(screen.game),
  );
  document.querySelector('input')?.focus();
};

const update = (next: Screen): void => {
  screen = next;
  render();
};

render();
