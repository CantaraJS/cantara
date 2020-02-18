---
id: cantara_config_js
title: cantara.config.js
---

Every package and application can have an associated `cantara.config.js` file in it's root.
Here, several parameters, depending on the type of the package or application, can be set.

In the very root you project, you can also create a `cantara.config.js` file to tweak several parameters.

Below you will a list of all possible values of a `cantara.config.js` file.

| property name         | where to use         |                                                                                                                                                                                         description                                                                                                                                                                                          |
| --------------------- | -------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
| env                   | react-apps/node-apps |                                                                                                                                                                       The required environment variables for this app.                                                                                                                                                                       |
| e2e                   | project root         |                                                                                                                                                                     Have a look at the [E2E testing guide](e2e_testing)                                                                                                                                                                      |
| displayName           | react-apps           |                                                                                                                                                    Display name which will be used in PWA manifest and inside `<title>` tag of index.html                                                                                                                                                    |
| themeColor            | react-apps           |                                                                                                                                                                            Theme color to be used in PWA manifest                                                                                                                                                                            |
| skipCacheInvalidation | serverless-endpoints | If this is set to true, nodemon is used to manually restart serverless offline after each change. Can be used to avoid reaching the maximum number of DB connection and the need to establish a new DB connection for every new call. Depends on your architecture if you need this. **Attention: Type checking is disabled because of performance reasons when this option is set to true** |
