---
id: migrations
title: Migrating to newer Cantara versions
---

## 1.x/2.x -> 3.x

To migrate to the newest Cantara version, first make sure to install the latest version:

```bash
yarn global add cantara
```

The current version introduced some breaking changes:

- Running React 17
- Using Webpack 5

From a usage perspective, the changes to be made are minimal.

Just navigate to your project and start a development server.
In the most ideal case, this should already work out of the box.

Some common problems which you could come along:

- "There are multiple instances of React in the same application": Run `yarn list react`. If this command yields more than one installed React version, find the place where it is installed (e.g. the project's root `packages.json`), remove it, and run the dev command again. This error should disappear.
- Problems with loading binary files like images or fonts: Webpack 5 introduced it's own asset loading mechanism (https://webpack.js.org/guides/asset-modules/), and although it closely mimics the behaviour of the file-loader and url-loader, there still might be some differences which you come across in some more complex use cases.
- The chunk splitting behaviour was changed to `all`, as that should be more effective (https://webpack.js.org/plugins/split-chunks-plugin/)
