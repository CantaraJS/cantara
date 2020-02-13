---
id: e2e_testing
title: E2E/Integration testing with Cypress
---

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
