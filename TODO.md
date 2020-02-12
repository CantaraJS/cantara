# TODO

## Required

- Write somewhat complete docs

  - Introduction
  - Quick Start
  - In-depth Tutorial
    - Introduction
    - Glossary
    - Folder structure
    - Creating a new project
    - Creating a new app/package
    - Development
    - Building, deploying and publishing
      - Build and deploy React Apps
      - Build and deploy NodeJS apps
      - Deploy serverless endpoints
      - Build and publish NPM packages
    - Environment Variables
    - Testing
      - Testing with Jest
      - Integration/E2E testing with Cypress
    - Executing commands for apps/packages (e.g. installing packages)
  - All Commands

    - init
    - dev
    - build
    - deploy
    - test
    - e2e
    - new
    - publish
    - run
    - exec-changed
    - test-changed
    - build-changed

  - Configuration files (cantara.config.js)
  - Official starter templates

- Write README for simple starter
  - Make simple starter responsive
- Implement "help" and "version" command
- Talk to CD try to integrate Cantara into their current workflow
  - Find out if tool is good enough for deployment needs
  - Customization needs? e.g. extending wepback/babel/TS config etc
- Implement Novitas Auth with Cantara and use it in Photogram
  - Write good docs for other developers
- Improve UI/UX of CLI
- Write integration tests for CLI
- Port Photogram Codebase to Cantara
- First public release
  - Issue template
  - Code of Conduct
  - Contribution guidelines
  - Write articles about Cantara, cross post on dev.to
  - But use Docusaurus for original blog posts
- After first release: Use commitizen
  - https://github.com/commitizen/cz-cli

## Nice to have

- "Mission Control": Intuitive Web Interface
  - Interface to manage all available Cantara Commands
- Optional Chaining
- I18n / Intl
- Add bundleanalyzer option to build cmd
- Replace Nodemon with custom Chokidar implementation
- When new version is available, show message.
- corejs?
- Add greenkeeper
- Add bundle analyzer (react apps and packages only)
- Faster build times
  - https://github.com/amireh/happypack

## Cool libs

- https://www.npmjs.com/package/figlet
- https://github.com/vadimdemedes/ink
- chalk
- commander
- program
- Inquirer
