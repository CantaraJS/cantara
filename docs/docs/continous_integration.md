---
id: continous_integration
title: Continous Integration
---

## Using Cantara in CI

On your local development machine you probably have Cantara installed globally. This is most likely not the case for your CI image. The recommended way of using Cantara is via `npx`, which is installed alongside `npm` (since version 5.2).

**Example:**

```bash
npx cantara build my-react-app
npx cantara deploy my-serverless-api
```

To avoid unexpected breaking changes break your build, it is advised to specify a version number:

```bash
npx cantara@0.5.1 build my-react-app
npx cantara@0.5.1 deploy my-serverless-api
```

## Re-build/deploy only changed parts of the repository

When deploying different parts of a monorepository, it is a commonly known problem that all parts of the application (the React app, the API, ecc.) need to be re-build and re-deployed, as it is hard to tell which parts changed. Thanks to Cantara's `exec-changed` command it is easy to re-build and deploy only the parts of the application which changed. This way, you can save precious CI time.

The `exec-changed` works as folllows:

```bash
ctra exec-changed <list> <command>
```

`list` is a comma separated list of applications/packages.

`command` is the command you want to execute when one of the apps/packages specified in `list` changed.

**Example**:
Assuming you are developing a React app called `admin-panel` which makes use of a local package caled `admin-ui`, use this command to re-build the `admin-panel` React app only of it changed.

```bash
cantara exec-changed admin-panel,admin-ui cantara build admin-panel
```

You don't need to use cantara commands, e.g.

```bash
cantara exec-changed admin-panel,admin-ui npm run build:admin
```

Or even:

```bash
cantara exec-changed admin-panel,admin-ui ./deploy-react-app.sh
```
