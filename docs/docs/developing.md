---
id: developing
title: Developing your app
---

Based on the new project we just created, let's start with the development process.

First thing we want to do is starting our Express API server. To do that, simple type:

```bash
ctra dev express-api
```

This will start our Express API server on port `3000`.

Now, in a new terminal, let's fire up the frontend development server:

```bash
ctra dev random-image-app
```

This will start a development server on `http://localhost:8080`

Open your favorite browser and navigate to that URL.
Now, you should be able to see a fancy random image. The URL for this image came from our Express API server.

Now, you could also stop the Express API server and start the serverless API:

```bash
ctra dev sls-api
```

Reloading the frontend should result in the exact same behaviour.

Yay! We now have a Fullstack React application without touching a single webpack config.

You can now edit any files, and thanks to automatic hot-reloading for every part of the stack, just save the file and you're done.

For the frontend, the _fresh_ **React-Refresh** is used :heart:
