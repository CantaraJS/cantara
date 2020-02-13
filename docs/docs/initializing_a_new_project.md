---
id: initializing_a_new_project
title: Initializing a new project
---

Let's get you a new folder on your Computer!
To kickstart a new Cantara project, use the [`init`](commands/init) command.
By default, the `cantara-simple-starter` template is used. You can find other templates on the [official list of starter templates](starter_templates) or specify a link to another git repository as the last parameter.

```bash
ctra init my-awesome-project
```

This will create a new folder `my-awesome-project`.

Now, let's go to that folder.

```bash
cd my-awesome-project
```

As you will see, **3** new folders and several new files were copied into the directory. Also, a new git repository was initialized.

The `cantara-simple-starter` template is a very simple application to display an awesome random image to your users. The project has the following structure:

```bash
├───node-apps
│   ├───express-api
│   │   ├───build
│   │   └───src
│   └───sls-api
│       └───src
├───packages
│   ├───core-api
│   │   └───src
│   └───random-image-widget
│       ├───build
│       │   └───random-image-widget
│       │       └───src
│       └───src
└───react-apps
    └───random-image-app
        ├───assets
        └───src
            └───components
                └───App
```

It essentially consists of **4** parts:

- A NodeJS backend API
  - Found under `node-apps`, the same API was implemented in two different ways:
    - As a NodeJS Express API (`node-apps/express-api`)
    - As a serverless API (`node-apps/sls-api`)
  - For the frontend, it doesn't make any difference which one you use, as they both expose exactly the same endpoints
- A re-usable NodeJS package to retrieve the random image (`packages/core-api`)
  - The package called `core-api` is used to retrieve the random image and simulates the bussiness logic of the backend API. It is used in both the serverless API and the Express API.
- A React component which actually makes the API call and displays the random image (`packages/random-image-widget`)
  - For demonstration purposes, this React component was also published to NPM and could be consumed by external applications
- The actual React application which display the random image (`react-apps/random-image-app`)
  - It makes use of the `random-image-widget` React component

This project structure is representative for how your Cantara project could look like. To create a new application or package you could just use the `new` command (which we will talk about later) or create the respective source files yourself. It's easy as that.

Now, as you know more about the structure of Cantara projects, let's see how you can actually start the development of your application.
