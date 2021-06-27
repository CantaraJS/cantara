![Cantara](docs/static/img/cantara.svg 'Cantara Logo')

<h1 align="center">
   <a href="https://cantara.js.org">Cantara</a>
</h1>

<h3 align="center">
<span style="color: #305BFF;">C</span>reate <span style="color: #305BFF;">A</span> <span style="color: #305BFF;">N</span>ode, <span style="color: #305BFF;">T</span>ypeScript <span style="color: #305BFF;">A</span>nd <span style="color: #305BFF;">R</span>eact <span style="color: #305BFF;">A</span>pplication
</h3>

<p align="center">
  <a href="https://github.com/semantic-release/semantic-release">
    <img src="https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg" alt="semantic-release" />
  </a>
  <a href="http://commitizen.github.io/cz-cli/">
    <img src="https://img.shields.io/badge/commitizen-friendly-brightgreen.svg" alt="Commitizen friendly" />
  </a>
  <a href="">
    <img src="https://github.com/CantaraJS/cantara/workflows/Release/badge.svg" alt="Release" />
  </a>
</p>

<h3 align="center">
  <a href="https://cantara.js.org/docs/quick_start/">Quickstart</a>
  <span> · </span>
  <a href="https://cantara.js.org/docs/docs_intro/">Tutorial</a>
  <span> · </span>
  <a href="https://cantara.js.org/docs/starter_templates/">Starters</a>
  <span> · </span>
  <a href="https://cantara.js.org/docs/maintainers_intro">Contribute</a>
</h3>

Cantara is a CLI tool to create Fullstack React applications in minutes

- **Zero configuration**: Cantara takes care of all the configurations for your project. No more fiddling around with webpack, typescript, or jest configs. There is even a config for the VS Code debugger.
- **Testing included**: Have a complete testing-setup before you even wrote your first line of code. [Jest](https://jestjs.io/) and [Cypress](https://www.cypress.io/) allow for all modern practices of automated software testing.
- **Backend**: Fullstack applications have one or more backend. Build plain NodeJS or serverless APIs that easily connect with the rest of your application.
- **Mono-repository**: All of your code lives inside a single repository. This makes it easy to share code between all your applications, while still keeping a clear separation of concerns thanks to packages..
- **Typescript**: Use TypeScript throught your entire application.

[Learn how to use Cantara for your next project](https://cantara.js.org/docs/introduction).

## Sponsors

The development of this project is sponsored by [Crystal Design GmbH](https://diva-portal.de).

![Crystal Design](https://avatars.githubusercontent.com/u/68067035?s=200&v=4)

## Table of contents

- [Installation](#installation)
- [Getting started](#getting-started)
- [Adding applications](#adding-applications)
- [How to Contribute](#how-to-contribute)
- [License](#license)

## Installation

    npm install -g cantara

## Getting started

You can get a new Cantara project up and running on your local dev environment in less than 5 minutes:

1. **Install the Cantara CLI.**

   ```shell
   npm install -g cantara
   ```

   _Requires Node.js version > 10_

2. **Create a new Cantara project.**

   Create your Cantara project with a single command:

   ```shell
   # creates a new cantara project using the default starter
   cantara init my-cantara-starter
   ```

   This command creates a project with the following structure:

   ```shell
   ├───node-apps
   │   ├───express-api
   │   └───sls-api
   ├───packages
   │   ├───core-api
   │   └───random-image-widget
   └───react-apps
      └───random-image-app
   ```

3. **Start the services in develop mode.**

   Now, move into your project's directory and start each application in a separate console:

   ```shell
   cd my-cantara-starter
   ```

   ```shell
   cantara dev random-image-app
   cantara dev express-api
   ```

   Tip: You can type `cantara` without any parameters into your console to start an interactive CLI wizard.

4. **Open code and start editing!**

   Your frontend app is now running at `http://localhost:8080` and your backend API is running at `http://localhost:3001`. Any code changes will update your application in real time.

Well done! At this point, you've got a working fullstack application waiting to be further developed. For a more in-depth guide on what you can do with Cantara, check out the [official tutorial](https://cantara.js.org/docs/docs_intro/).

## Adding applications

You can have multiple applications inside your Cantara project. There are 3 different types of applications. For each type, there is a respective folder inside of your cantara project:

- nodes-apps:
- react-apps:
- packages:

To add a new application to your project, simply create a folder with the application name inside the parent folder of the respective application type, and put your source code inside that folder.

For example, let's say you wanted to add another frontend application to the project from the Getting-started tutorial. To do so, you create a new folder inside of the `react-apps` folder called `dashboard`, where you put the code for your admin dashboard.

```shell
...
└───react-apps
   └───random-image-app
   └───admin-dashboard # new react app
```

## How to Contribute

This project is still young and every contribution helps to turn this project into a mature tool that makes developer's lives easier.

Checkout our [**Contributing Guide**](https://cantara.js.org/docs/maintainers_intro) to learn how you can start contributing to the project.

## License

Licensed under the [MIT License](./LICENSE).
