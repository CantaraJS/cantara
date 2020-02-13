---
id: adding_new_packages
title: Adding new apps/packages
---

So now that we are ready to start developing our application, it's time to extend our codebase and add new parts to it!

There are essentially two possible ways to add new apps/packages to your project:

## Using Cantara's `new` command

This is the easier of way of adding new apps/packages to your project. The new command has the following syntax:

```bash
ctr new <react-app|node-app|serverless|js-package|react-component> <new-name>
```

The first parameter specifies what you want to add to your repo:

- A new React application (`/react-apps`)
- A new NodeJS application (`/node-apps`)
- A new serverless endpoint (`/node-apps`)
- A new JS package (`/packages`)
- A new React Component (`/packages`)

As the second parameter, specify give it a name.

**Example**: Adding a new React component named `awesome-image-viewer` as a re-usable NPM package to your project would look like this:

```bash
ctra new react-component awesome-image-viewer
```

## Adding parts _manually_ by creating the respective files yourself

To add a new package/Node app/React app to your project, simply create a new folder either under `node-apps`, `packages` or `react-apps` and create a `src` folder. Depending if it is a React app/component or not, create a new file `index.ts` / `index.tsx` in the `src` directory. For new serverless endpoints, you also need to create a `handler.js` and a `serverless.yml` file (but not under `src`, one layer above). And that's it, now you are ready to go!

Now, that you've create a new package or app, you can start using it straight away.
For packages, just `import` them into your apps.
For applications, start the development using the `dev` command.
