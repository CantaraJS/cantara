---
id: css_modules_types
title: TypeScript + CSS Modules
---

When using CSS Modules, it's handy to have correctly typed imports during development.

This should work out of the box with Cantara thanks to an [awesome language server plugin](https://github.com/mrmckeb/typescript-plugin-css-modules).

Because it's just a language server plugin, this won't work during build time and is just a helper when developing your app with VSCode.

To use this plugin with Visual Studio Code, you should set your workspace's version of TypeScript, which will load plugins from your tsconfig.json file.

For instructions, see: [Using the workspace version of TypeScript](https://code.visualstudio.com/docs/typescript/typescript-compiling#_using-the-workspace-version-of-typescript)
