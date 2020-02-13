---
id: quick_start
title: Quick Start
---

## What to expect

After this quick start guide, you'll have

- A ExpressJS based REST API written in TypeScript
- The same REST API, but as a serverless endpoint, written in TypeScript
- A re-usables React Component which consumes the REST API and can be published to NPM with just one command
- A React Application which makes use of the React Component

All in under 10 minutes!

That should be a good starting point to develop your own fullstack application.

## Installing Cantara

Install Cantara globally using your favorite package manager.

```bash
npm i -g cantara
```

Now you can access Cantara in the command line using one of those aliases:

```bash
cantara
ctra
```

## Initialize a new project

Let's get you a new folder on your computer!
To kickstart a new Cantara project, use the [`init`](commands/init) command.

This will create a new folder `my-awesome-project`.

Now, let's go to that folder.

```bash
cd my-awesome-project
```

As you will see, **3** new folders and several new files were copied into the directory. Also, a new git repository was initialized.

The [`init`](commands/init), if executed with no other parameters, clones the [cantara-simple-starter](https://github.com/CantaraJS/cantara-simple-starter) project, which is a simple example project, consisting of an ExpressJS REST API, a serverless API and a React App. The functionality of this app is simple: Displaying a random image from Unsplash to the user.

Look at the code to get a better understanding of how the different parts work together.

## Start the development servers

We can now start developing the server and the React app using the `dev` command.

First, let's start our ExpressJS REST API in development mode:

```bash
ctra dev express-api
```

If you now edit files under `node-apps/express-api`, the server automatically restarts.

Now, let's start our React App development server!

```bash
ctra dev random-image-app
```

Goto [http://localhost:8080](http://localhost:8080) and you should now see a nice random image which was pulled from our ExpressJS Server.

Alternatively, you can also start the serverless REST API in development mode. It is the exact same API, just _serverless_.

```bash
ctra dev sls-api
```

To consume this API instead of the ExpressJS API, make sure to change the port under `react-apps/random-image-app/.env.development` to `3002`! Changing environment variables requires a server restart.

Now, get creative and play a bit around with the different parts of the application, to get a better feeling of how everything works together! :crystal_ball:

## Further reading

Now you have the basics to start developing your app.
For the next steps, e.g. creating a production build of your app, publishung packages to NPM or writing and executing tests, go the [Guides section of the docs](guides_intro). Here, all of the more advanced topics are covered. Have fun!
