---
id: live_link
title: 🔗 Live Link external packages during development
sidebar_label: 🔗 Live Link
---

When developing an application, it sometimes occurs that you installed packages from another Cantara project you own. In that case, it would be handy if changes to the code of that package would be immediately reflected as if it was local code. This way, the external package can be tested duuring development in other contexts.

⚠ _Live Link is only active for applications during development!_

## How to use it

In any Cantara project, you can execute three Live Link related commands:

```bash
ctra link-add
ctra link-ls
ctra link-rm
```

### Adding Live Links

To live link an external Cantara package, just execute `ctra link-add` and a list of all external packages from all projects on your drive appear. Select/search one, press enter, and you're done!

Now, when you start the development server, and you make changes to the external package, they are immediately reflected using Hot Reloading!

⚠ _In order that all packages show up when executing `ctra link-add`, every projects needs to be started with Cantara at least once so that Cantara knows about that project on your drive. Sometimes, it also needs to be done after version updates._

### Listing all currently linked packages

To get a list of all currently linked packages, just execute `ctra link-ls`.

### Removing live link

To remove a live link, just execute `ctra link-rm` and choose the package you would like to unlink.

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
