---
id: building_packages_apps
title: Building packages/apps
---

To create an optimized production build of your application or package, use the `build` command.

```bash
ctra build <app-name|package-name>
```

The result will be available under the `build` folder of the specified application/package.

## Differences between packages and apps

### Building packages

When building packages, you get a ready to use NPM package under `build` which can be [published to NPM](in_depth_tutorial_publish_to_npm).

Besides that, **TypeScript** types are automatically generated. So anyone consuming this package gets autocompletion and intellisense out of the box! What a time to be alive.

The package which is generated to be used in CommonJS environments doesn't contain any dependencies. Which is the way it should be. But if you would like to use your package in e.g. directly the browser by including it via a `<script>` tag, Cantara also create a minfied `UMD` build, called `<package-name>.min.umd.js`.

## Building apps

When building React apps, the contents of the `build` folder can directly be published to a CDN/server.

Building NodeJS apps results in an executable `main.js` file. Execute `node main.js` to start your server in production.

Directly building serverless endpoints doesn't work, as this happens as part of the `deploy` command.
