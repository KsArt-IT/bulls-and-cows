import { SUPPORTED_BASES, SUPPORTED_LENGTHS } from '../core/constants.js';
import type { Settings, SupportedBase, SupportedLength } from '../core/types.js';
import { availableLengths } from '../core/utils/availableLengths.js';
import { countPossibleSecrets } from '../core/utils/countPossibleSecrets.js';
import { BASE_NAMES } from './baseNames.js';
import { element, optionButton } from './dom.js';

export type SettingsHandlers = {
  readonly onLength: (length: SupportedLength) => void;
  readonly onBase: (base: SupportedBase) => void;
  readonly onStart: () => void;
};

const optionGroup = (heading: string, buttons: readonly HTMLButtonElement[]): HTMLElement =>
  element('fieldset', { className: 'settings__group' }, [
    element('legend', { className: 'settings__title', text: heading }),
    element('div', { className: 'settings__options' }, buttons),
  ]);

export const settingsScreen = (settings: Settings, handlers: SettingsHandlers): HTMLElement => {
  const allowed = availableLengths(settings.base);

  const lengthGroup = optionGroup(
    'Secret number length',
    SUPPORTED_LENGTHS.map((length) =>
      optionButton(String(length), length === settings.length, !allowed.includes(length), () =>
        handlers.onLength(length),
      ),
    ),
  );

  const baseGroup = optionGroup(
    'Number base',
    SUPPORTED_BASES.map((base) =>
      optionButton(`${BASE_NAMES[base]} (${base})`, base === settings.base, false, () =>
        handlers.onBase(base),
      ),
    ),
  );

  const possibleSecrets = element('p', {
    className: 'settings__info',
    text: `Possible secrets for these settings: ${countPossibleSecrets(settings.length, settings.base)}`,
  });

  const start = element('button', { className: 'start', text: 'Start game' });
  start.type = 'button';
  start.addEventListener('click', handlers.onStart);

  const header = element('header', { className: 'header' }, [
    element('h1', { text: 'Bulls and Cows' }),
  ]);

  const settingsSection = element('section', { className: 'settings' }, [
    lengthGroup,
    baseGroup,
    possibleSecrets,
    start,
  ]);

  return element('main', { className: 'app' }, [header, settingsSection]);
};
