---
id: tailwindcss
title: How to use Tailwind CSS
---

First of all, you need to make sure that tailwindcss is installed.

```bash
yarn add -D tailwindcss
```

After that, create a `tailwind.config.js` file in your project root.

```javascript
module.exports = {
  darkMode: false,
  theme: {},
  variants: {},
  plugins: ['@tailwindcss/forms'],
};
```

**Two things are important here:**

- Do not create the `purge` property yourself. Cantara will take care of that
- Do not directly `require` the plugins you installed, but just write the package name of it. This is needed so Cantara can correctly resolve it's path. Make sure plugins are installed in the root of the project.

That's it. Now you should be able to use Tailwind CSS.

**Note:** Packages aren't supported currently.
