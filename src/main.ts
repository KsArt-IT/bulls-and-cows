import type { Settings } from './core/types.js';
import { selectBase } from './core/utils/selectBase.js';
import { settingsScreen } from './ui/settingsScreen.js';

let settings: Settings = { length: 4, base: 10 };

const render = (): void => {
  document.body.replaceChildren(
    settingsScreen(settings, {
      onLength: (length) => {
        settings = { ...settings, length };
        render();
      },
      onBase: (base) => {
        settings = selectBase(settings, base);
        render();
      },
      onStart: () => {
        // TODO: createGame
      },
    }),
  );
};

render();
