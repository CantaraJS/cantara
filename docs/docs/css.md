---
id: css
title: CSS
---

There are essentially **3** ways to style your React applications using Cantara. Cantara tries to make no assumptions how you plan to use CSS.

## Using CSS-in-JS

You can just use your favorite CSS-in-JS solution like you are used to. Cantara doesn't change that in any way.

## Importing CSS files directly

You can can import css files anywhere:

```javascript
// SomeComponent.tsx
import './index.css';
```

Styles defined like this will be applied globally.

## CSS modules

By appending `.module.css` to your CSS file, you can make use of CSS modules, like so:

```css
/* index.modules.css */
.red-box {
  background: red;
  height: 20px;
  width: 20px;
}
```

```javascript
// SomeComponent.tsx
import { redBox } from './index.module.css';
```
