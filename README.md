# Bulls and Cows

A number-guessing game in a functional style, built with TDD.
Task for RS School, course JS/Fullstack 2026 Q3.

- Task: [Bulls and Cows](https://github.com/rolling-scopes-school/tasks/blob/master/fullstack-engineering/tasks/bulls-and-cows/README.md)
- Code: branch [`bulls-and-cows`](../../tree/bulls-and-cows)
- Deploy: [Play the game](https://ksart-it.github.io/bulls-and-cows/)

## Rules

The computer picks a secret number of unique digits.
After each guess you get a hint:

- **bulls** — right digit in the right place;
- **cows** — right digit in the wrong place.

The game ends when all digits are bulls.
Settings: length 2–6, base bin / oct / dec / hex.

## Stack

TypeScript · ESLint · Prettier · Husky · lint-staged · Vitest

## Scripts

| Command          | What it does                  |
| ---------------- | ----------------------------- |
| `npm run build`  | compile TypeScript with `tsc` |
| `npm run lint`   | check code with ESLint        |
| `npm run format` | format code with Prettier     |
| `npm test`       | run tests                     |

## Author

[KsArt-IT](https://github.com/ksart-it)
