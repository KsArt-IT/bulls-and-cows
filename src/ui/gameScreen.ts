import type { GameState } from '../core/types.js';
import { createDigitValidator } from '../core/utils/createDigitValidator.js';
import { hasDuplicateDigits } from '../core/utils/hasDuplicateDigits.js';
import { isValidGuess } from '../core/utils/isValidGuess.js';
import { element } from './dom.js';
import { plural } from './plural.js';

export type GameHandlers = {
  readonly onGuess: (guess: string) => void;
  readonly onNewGame: () => void;
};

const guessForm = (state: GameState, onGuess: (guess: string) => void): HTMLFormElement => {
  const { length, base } = state.settings;
  const isDigit = createDigitValidator(base);

  const input = element('input', { className: 'guess__input' });
  input.maxLength = length;
  input.autocomplete = 'off';
  input.setAttribute('aria-label', `Your guess: ${length} unique digits`);

  const submit = element('button', { className: 'guess__submit', text: 'Check' });
  submit.type = 'submit';
  submit.disabled = true;

  input.addEventListener('input', () => {
    input.value = [...input.value].filter(isDigit).join('');

    const hasDuplicates = hasDuplicateDigits(input.value);
    const isComplete = isValidGuess(input.value, length, base);

    input.classList.toggle('guess__input--invalid', hasDuplicates);
    input.classList.toggle('guess__input--valid', isComplete);
    input.setAttribute('aria-invalid', String(hasDuplicates));
    submit.disabled = !isComplete;
  });

  const form = element('form', { className: 'guess' }, [input, submit]);
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (isValidGuess(input.value, length, base)) onGuess(input.value);
  });
  return form;
};

const historyList = (history: GameState['history']): HTMLElement =>
  element(
    'ol',
    { className: 'history' },
    history.map(({ guess, result }) =>
      element('li', {
        className: 'history__item',
        text: `${guess.join('')} — ${result.bulls} bulls, ${result.cows} cows`,
      }),
    ),
  );

const newGameButton = (onNewGame: () => void): HTMLButtonElement => {
  const button = element('button', { className: 'start', text: 'New game' });
  button.type = 'button';
  button.addEventListener('click', onNewGame);
  return button;
};

const winBlock = (state: GameState, onNewGame: () => void): HTMLElement => {
  if (state.finishedAt === null) throw new Error('Won game must have finishedAt');
  const seconds = Math.round((state.finishedAt - state.startedAt) / 1000);

  return element('section', { className: 'win' }, [
    element('p', {
      className: 'win__message',
      text: `You won in ${plural(state.history.length, 'attempt')}, ${seconds} s`,
    }),
    newGameButton(onNewGame),
  ]);
};

export const gameScreen = (state: GameState, handlers: GameHandlers): HTMLElement =>
  element('main', { className: 'app' }, [
    element('h1', { text: 'Bulls and Cows' }),
    state.status === 'won'
      ? winBlock(state, handlers.onNewGame)
      : guessForm(state, handlers.onGuess),
    historyList(state.history),
  ]);
