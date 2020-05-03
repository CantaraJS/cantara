---
id: publish_to_npm
title: Publishing packages to NPM
---

Besides being able to use packages internally in the monorepository, you can also publish them to NPM install them in other (hopefully Cantara :wink:) projects.

To do that, you first need to build the package yourself.

```bash
ctra build <package-name>
```

After that, the compiled version of your package can be found under `packages/<package-name>/build`.

TypeScript types are generated automatically! So all consumers of this packages will get autocompletion out of the box.

Now you are ready to publish it!

To do this, just invoke the standard npm `publish` command.
Make sure that `private` is not set to true `true` in the package's `package.json`.

```bash
ctra run <package-name> publish
```

This will execute `npm publish` for your package.

**Congrats! Your package is now on NPM**
