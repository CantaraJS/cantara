---
id: live_link
title: Live Link external packages during development
sidebar_label: Live Link
---

## Cantara Live Link

Live Link is only active for applications during development!

## Shortcomings

In 99% of the cases, you'll be able to use Cantara Live Link without issues.
There are some edge cases though which might cause some problems.

### Dependecy resolving

The dependencies are resolved in the following order:

- App 'node_modules' folder
- Project's 'node_modules' folder
- Cantara (CLI package) 'node_modules' folder
- Currently linked package's 'node_modules' folder
- Currently linked package root (project) 'node_modules' folder

For example if `react` is a dependency of the external package and of the application you are currently developing, then `react` will be used from the app's `node_modules` folder. **Regardless of the version**. This may cause some unexpected behaviour.
