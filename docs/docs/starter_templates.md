---
id: starter_templates
title: Official starter templates
---

**This is the list of official start templates for Cantara**

Until now, there's only one:

## Cantara Simple Starter

[Github](https://github.com/CantaraJS/cantara-simple-starter)

The `cantara-simple-starter` template is a very simple application to display an awesome random image to your users.

It is the default template and is used when no other template is specified.

The project has the following structure:

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

This project structure is representative for how your Cantara project could look like.
