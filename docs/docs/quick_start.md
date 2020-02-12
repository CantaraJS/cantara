---
id: quick_start
title: Quick Start
---

## Installing and getting ready

Install Cantara globally using your favorite package manager.

```bash
npm i -g cantara
```

Now you can access Cantara in the command line using one of those aliases:

```bash
cantara
ctra
## For examle
ctra dev my-app
```

## Initializing a new project

Now let's get you a new folder on your Computer!
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

## Developing your app

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

## Adding new apps/packages

So now that we are ready to start developing our application, it's time to extend our codebase and add new parts to it!

There are essentially two possible ways to add new apps/packages to your project:

### Using Cantara's `new` command

This is the easier of way of adding new apps/packages to your project. The new command has the following syntax:

```bash
ctr new <react-app|node-app|serverless|js-package|react-component> <new-name>
```

The first parameter specifies what you want to add to your repo:

- A new React application (`/react-apps`)
- A new NodeJS application (`/node-apps`)
- A new serverless endpoint (`/node-apps`)
- A new JS package (`/packages`)
- A new React Component (`/packages`)

As the second parameter, specify give it a name.

**Example**: Adding a new React component named `awesome-image-viewer` as a re-usable NPM package to your project would look like this:

```bash
ctra new react-component awesome-image-viewer
```

### Adding parts _manually_ by creating the respective files yourself

To add a new package/Node app/React app to your project, simply create a new folder either under `node-apps`, `packages` or `react-apps` and create a `src` folder. Depending if it is a React app/component or not, create a new file `index.ts` / `index.tsx` in the `src` directory. For new serverless endpoints, you also need to create a `handler.js` and a `serverless.yml` file (but not under `src`, one layer above). And that's it, now you are ready to go!

Now, that you've create a new package or app, you can start using it straight away.
For packages, just `import` them into your apps.
For applications, start the development using the `dev` command.

## Testing with Jest

Testing your React Components/JS packages/NodeJS Apps/React Apps with Cantara works by simply executing the `test` command.

```bash
ctra test <name> [jestParameters...]
```

All files ending in `.test.ts` or `.test.tsx` (React) will be executed.
For testing React Components, the awesome [React Testing Library](https://testing-library.com/) is used.

Just have a look in the `packages/random-image-widget/src` folder for an example.

If you for example want to run tests for the `random-image-widget` component, simply execute:

```bash
ctra test random-image-widget
```

At the end of the `test` command, you can append any [Jest](https://jestjs.io/docs/en/cli) CLI option, e.g. `--watch`:

```bash
ctra test random-image-widget --watch
```

## Environment variables

There are two ways of passing in environment variables to your applications/tests:
Either throug the actual environment variables of the system Cantara is running on or through `.env` files.

Passing in environment variables through directly from the system is usally used in CI environments, whereas the use case of `.env` files is primarily in development environments, but that depends on your workflow.

### Adding a new environment variable

The first step when adding a new environment variable is adding a new entry under `env` in the `cantara.config.js` array. Go to the `cantara.config.js` file of the app/package where the environment variable is needed. If there is no `cantara.config.js`, create a new one. It could look like that:

```javascript
module.exports = {
  env: ['MY_ENV_VAR'],
};
```

_Usually_ when adding environment variables to packages it's just because they are needed during tests.

By adding `MY_ENV_VAR` to this array, Cantara now knows that `MY_ENV_VAR` must be defined during execution and can warn the developer if that's not the case.

### Using .env files

Now, in the application folder create a new file called `.env.development` and add the folllowing content:

```bash
MY_ENV_VAR=env_var_value123
```

When you now start the development of your app using the `dev` command, the value of `process.env.MY_ENV_VAR` will be `env_var_value123`. When executing the `test` or `e2e` command, Cantara will look if there is a file called `.env.test` in the app's folder. If not, it will fall back to `.env.development`. For building/deploying, Cantara will look for a file called `.env.production`.

### Defining environment variables manually

Instead of creating those files, you can also define the environment variabled yourself by setting them in the current environment, e.g. your CI server. **You need to prefix them**, for example: If your CI system wants to run the `build` command for one of your apps and there's a environment variable called `MY_ENV_VAR` required, define it by prefixing it with `PRODUCTION_`, this `PRODUCTION_MY_ENV_VAR`. This can also be done for the testing environment by setting `TEST_MY_ENV_VAR`.

### The --stage parameter

By appending the `--stage` parameter to any Cantara command, you can explicitly define which `.env` file or which environment variables from the system should be used. For example if you execute `ctra dev my-app --stage production` the `.env.production` file will be used. You can also create custom stages, e.g. `.env.staging` and execute commands using those stages, e.g. `ctra build --stage staging`. This can be useful if you have other environments then just your local development environemnt and the production environment, e.g. a staging server.

## Creating production builds

To create an optimized production build of your application or package, use the `build` command.

```bash
ctra build <app-name|package-name>
```

The result will be available under the `build` folder of the specified application/package.

## Deploying serverless endpoints

## Publishing packages to NPM

## Continous Integration

One very useful command for CI is the `build-changed` command.

```bash
ctra build-changed
```

This will only rebuild the parts of your repository which changed since the last commit and can therfore save precious CI execution time.

The counterpart for testing is:

```bash
ctra test-changed
```

Like this, you can re-build and test only the parts of your repository which actually changed.

Currently, you need to integrat those commands with your CI system yourself. Contributions in that area are very welcome!

To execute arbitrary commands when parts of the repository changed, you can use the `exec-changed` command. **Example**:

```bash
ctra exec-changed express-api ./upload-to-server.sh
```

If you execute this command in your CI system, the `upload-to-server.sh` script will only be executed if the code in `node-apps/express-api` changed since the last commit. This command can be useful to do stuff like uploading newly generated assets to a CDN or a server.

## Executing arbitrary commands for apps/packages

Instead of `cd`-ing every time into the direcory of an app or package, you can just use the `run` command. This executes the specified command in the directory of the specified app/package.

**Example**: List the directory content of your express-api

```bash
ctra run express-api ls
```

**Note**: For NPM commands, `npm` can be left away. So when you for example want to install a new package, execute

```bash
ctra run express-api install cors
```

This installs the package `cors` from NPM.

## E2E/Integration testing with Cypress

First, you need to make sure that Cypress is installed and also create the `cypress` folder in the root of your repository yourself, as you would do normally.

After that, add a new `cantara.config.js` file in the root of your repository (if not done so already).

Add the following content:

```javascript
module.exports = {
  e2e: {
    executeBefore: [
      'ctra dev express-api --stage test',
      'ctra dev random-image-app --stage test',
    ],
    portsToWaitFor: [8080, 3000],
    testCommand: 'cypress run',
  },
};
```

Now, when you execute `ctra e2e` the following happens:

- The Express server is started in development mode
- The random-image React app is also started in development mode
- Cantara waits for both servers on the ports `8080` and `3000` to be available
- As soon as the ports are available, `cypress run` is executed (so the tests in your `cypress` folder are executed)

As you can see, the commands under `executeBefore` and the `testCommand` could have any value, so it's not solely limited to Cypress.

## List of official starters
