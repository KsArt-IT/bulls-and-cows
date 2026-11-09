import { evaluateGuess } from './utils/evaluateGuess.js';
const guessKey = (guess) => guess.join('').toLowerCase();
export const makeGuess = (state, guess, now) => {
    const key = guessKey(guess);
    if (state.status === 'won' || state.history.some((attempt) => guessKey(attempt.guess) === key)) {
        return state;
    }
    const result = evaluateGuess(state.secret, guess);
    const isWon = result.bulls === state.settings.length;
    return {
        ...state,
        history: [...state.history, { guess, result }],
        status: isWon ? 'won' : 'playing',
        finishedAt: isWon ? now : null,
    };
};
//# sourceMappingURL=makeGuess.js.map