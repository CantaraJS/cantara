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

To do this, use the `publish` command.

```bash
ctra publish <package-name>
```

A wizard will prompt you some questions.

**Congrats! Your package is now on NPM**
