---
id: environment_variables
title: Environment variables
---

There are two ways of passing in environment variables to your applications/tests:
Either throug the actual environment variables of the system Cantara is running on or through `.env` files.

Passing in environment variables through directly from the system is usally used in CI environments, whereas the use case of `.env` files is primarily in development environments, but that depends on your workflow.

## Adding a new environment variable

The first step when adding a new environment variable is adding a new entry in the `env` array of the app's `cantara.config.js`. Go to the `cantara.config.js` file of the app/package where the environment variable is needed. If there is no `cantara.config.js`, create a new one. It could look like that:

```javascript
module.exports = {
  env: ['MY_ENV_VAR'],
};
```

_Usually_ when adding environment variables to packages it's just because they are needed during tests.

By adding `MY_ENV_VAR` to this array, Cantara now knows that `MY_ENV_VAR` must be defined during execution and can warn the developer if that's not the case.

## Using .env files

Now, in the application folder create a new file called `.env.development` and add the folllowing content:

```bash
MY_ENV_VAR=env_var_value123
```

When you now start the development of your app using the `dev` command, the value of `process.env.MY_ENV_VAR` will be `env_var_value123`. When executing the `test` or `e2e` command, Cantara will look if there is a file called `.env.test` in the app's folder. If not, it will fall back to `.env.development`. For building/deploying, Cantara will look for a file called `.env.production`.

### Project wide .env files

If some env var values are needed in multiple applications, e.g. in two NodeJS APIs, you can create a `.env.<stage>` file in the project's root. This way, you don't need to define the env variable value twice.

## Defining environment variables manually

Instead of creating those files, you can also define the environment variabled yourself by setting them in the current environment, e.g. your CI server. **You need to prefix them**, for example: If your CI system wants to run the `build` command for one of your apps and there's a environment variable called `MY_ENV_VAR` required, define it by prefixing it with `PRODUCTION_`, this `PRODUCTION_MY_ENV_VAR`. This can also be done for the testing environment by setting `TEST_MY_ENV_VAR`.

## The --stage parameter

By appending the `--stage` parameter to any Cantara command, you can explicitly define which `.env` file or which environment variables from the system should be used. For example if you execute `ctra dev my-app --stage production` the `.env.production` file will be used. You can also create custom stages, e.g. `.env.staging` and execute commands using those stages, e.g. `ctra build --stage staging`. This can be useful if you have other environments then just your local development environemnt and the production environment, e.g. a staging server.
