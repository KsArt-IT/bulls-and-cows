# Design

Notation: `n` is the secret length (2–6), `b` is the numeral base (2, 8, 10, 16).

## 1. Data structures and algorithms

### Data structures

- **`Secret = readonly string[]`** ([types.ts](src/core/types.ts)). Digits are strings, not numbers, because a secret can start with `0` and hex has letters. An array works with `map`, `filter` and `reduce`. `readonly` makes it impossible to change.
- **`GameState`** ([types.ts](src/core/types.ts)) is an immutable object. `makeGuess` adds an attempt with `[...history, attempt]`, so the old state and its history never change.
- **`Set`** is used in three places, always for an `O(1)` lookup:
  - the allowed digits in the closure of `createDigitValidator`;
  - the secret digits in `evaluateGuess`;
  - the duplicate check in `hasDuplicateDigits`, used by `isValidGuess`.
- **`Map`** is the cache in `memoize` ([memoize.ts](src/core/utils/memoize.ts)). The key is `JSON.stringify(args)`, so only simple arguments are supported. The cache lives in a closure, so from outside the memoized function stays pure.
- **`GameRecord[]`** is one list in `localStorage`. Each record has its own `base` and `length`, and records are grouped by the pair base + length.
- **`Screen`** is a union `settings | game` in [main.ts](src/main.ts). The settings screen is not rendered during a round, so settings cannot change after the start.

### Algorithms

- **`evaluateGuess`**: lowercase both sides → `bulls` = `filter` by equal digit at the same index → `matches` = `filter` by presence in the secret `Set` → `cows = matches - bulls`. The digits are unique, so this counts each common digit once.
- **`countPossibleSecrets`**: `P(b, n) = b × P(b − 1, n − 1)`. Stop conditions: `n = 0` gives `1` (an empty secret can be chosen in one way), `n > b` gives `0`. The recursion calls the memoized constant, so inner calls also come from the cache.
- **`generateSecret`**: pick from the remaining digits. `index = floor(random() × pool.length)`, then the chosen digit is removed from the pool with `filter`. It is a `reduce` over `Array.from({ length })`. We do not "pick a random digit until it is new": with a constant `random` such a loop never ends.
- **`addRecord`**: sort a copy of the list (fewer attempts first, then less time), then keep the first 3 records of each base + length group. Sorting goes first, otherwise the best records could be cut off.

## 2. Big O

| Function               | Complexity                         | Why                                                                                                                                                    |
| ---------------------- | ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `generateSecret`       | `O(n · b)`                         | `n` steps, each step filters a pool of at most `b` digits and copies the secret so far (`O(n)`); strictly `O(n · (b + n))`, but `n ≤ b`, so `O(n · b)` |
| `evaluateGuess`        | `O(n)`                             | lowercasing, building the `Set` and two `filter` passes are linear, `has` is `O(1)`                                                                    |
| `isValidGuess`         | `O(n + b)`                         | the validator builds a `Set` of `b` digits, then one pass over `n` characters (length, alphabet, duplicates)                                           |
| `countPossibleSecrets` | first call `O(n)`, repeated `O(1)` | recursion depth is `n`; a repeated call with the same arguments is taken from the cache                                                                |

Memoization note: inside one call the subproblems never repeat. It is a chain, not a tree like Fibonacci, so the cache does not speed up a single call. The gain is on repeated calls: the settings screen calls the function on every render.

Extra: `createDigitValidator` is `O(b)` to build and `O(1)` per check. `addRecord` is `O(r²)` for `r` records (the group check inside `filter`), and `r` is at most 48: there are 16 groups (bin has only length 2, the other three bases have 5 lengths each: 1 + 5 + 5 + 5) with 3 records per group.

## 3. Clean code principles

- **Single responsibility.** `makeGuess` ([makeGuess.ts](src/core/makeGuess.ts)) does not validate the guess; `isValidGuess` does it before the call.
- **DRY.**
  - The alphabet and the supported lists live in [constants.ts](src/core/constants.ts).
  - The rule "length ≤ base" is one function, `availableLengths`, used by the settings UI and by `selectBase`.
  - `createDigitValidator` is used in `isValidGuess` and in the input filter of [gameScreen.ts](src/ui/gameScreen.ts).
  - The duplicate check is one function, `hasDuplicateDigits`, used by `isValidGuess` and by the input highlighting.
  - `BASE_NAMES` is in [baseNames.ts](src/ui/baseNames.ts), shared by the settings screen and the leaderboard.
- **KISS / YAGNI.** No `RangeError` branches (the types already protect), no extra settings types, no bundler.
- **Pure functions and dependency injection.** `random` and `now` are parameters of `generateSecret`, `createGame` and `makeGuess`. Side effects live only in [main.ts](src/main.ts) and [storage.ts](src/infra/storage.ts); the storage itself is a parameter of `loadRecords` and `saveRecords`.
- **Meaningful names.** The two helpers that build a key have different names for different jobs: `guessKey` in `makeGuess` (the identity of an attempt, case-insensitive) and `groupKey` in `addRecord` (the base + length group).
- **Safe I/O.** `storage.ts` uses `try/catch` and the type guard `isGameRecord`; broken or forged data is dropped and the game works without storage.
- **Layers.** `src/core` has no DOM and no browser API, so it is tested without a browser; `src/infra` holds `localStorage` and `src/ui` holds DOM code.
