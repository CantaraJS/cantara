---
id: raps
title: Runtime App Presets (RAPs)
---

A common need for more complex apps (frontend or backend) are configuration presets: For example different client application configurations. Instead of hard-coding them in your code and commenting them back in and out, RAPs are a first class citizen of Cantara.

## Setup

Presets need to be stored in JSON files under a folder called `presets` inside a React, Node or Serverless app. If you want to use RAPs, create that folder in the root of an app and create a file called `default.json`. Populate it with some content, e.g. a client specific API URL:

```json
{
  "apiUrl": "https://client-1.myapi.com"
}
```

Now, to create more presets, just create additional JSON files with arbitrary names, e.g. `client-1.json`.

After that, make sure that your `.gitignore` file contains the folllowing:

```
**/src/app-preset/
```

As Cantara auto-generates some TypeScript files we don't want to include in version control.

## Using them in your app

Now, when you start the development of an app, you can pass a `--preset` or `-p` parameter with the name of your preset (without `.json`).

**You can also omit this parameter**. This way, a CLI autocomplete will appear and you can choose the preset from a list.

Now, in your code, you can easily access the preset from anywhere in your app, by import it from `@app-preset`.

```javascript
import preset from '@app-preset';

console.log(preset.apiUrl);
```

Have fun! 🐔
