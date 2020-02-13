---
id: testing_with_jest
title: Testing with Jest
---

Testing your React Components/JS packages/NodeJS Apps/React Apps with Cantara works by simply executing the `test` command.

```bash
ctra test <name> [jestParameters...]
```

All files ending in `.test.ts` or `.test.tsx` (React) will be executed.
For testing React Components, the awesome [React Testing Library](https://testing-library.com/) is used.

Just have a look in the `packages/random-image-widget/src` folder for an example.

If you for example want to run tests for the `random-image-widget` component, simply execute:

```bash
ctra test random-image-widget
```

At the end of the `test` command, you can append any [Jest](https://jestjs.io/docs/en/cli) CLI option, e.g. `--watch`:

```bash
ctra test random-image-widget --watch
```
