---
id: external_dependencies
title: Overwriding the External Dependencies Map for Webpack
---

Cantara uses webpack for building and bundeling. When building packages, cantara currently creates two different builds, the `commonjs` and the `umd` build.

The `commonjs` build are used via npm and externalizes all dependencies, since they will be included on install via the `package.json`. The `umd` build are used as static import, e.g. over a CDN and externalizes only `peerDependencies`.

Webpack references external dependencies by default over there package name, which is always sufficient, if the dependencies are included as `node modules`. However sometimes it is necessary to overwrite this mapping, for instance if a dependency is expected to be present as global variable (i.e. included as static script).

Cantara provides this mapping for `React` and `ReactDOM`, in the `umd` builds of react components. If additional mappings are necessary, they can be specified in the `cantara.config.js`.

If the mapping is added directly to the `externalDependencies` property, it is performed for all build types:

```javascript
module.exports = {
  externalDependencies: {
    jquery: 'jQuery',
  },
};
```

By nesting it can be controlled more fine grained, for only a specific build type:

```javascript
module.exports = {
  externalDependencies: {
    umd: {
      jquery: 'jQuery',
    },
  },
};
```
