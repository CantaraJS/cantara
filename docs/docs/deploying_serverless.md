---
id: deploying_serverless
title: Deploying serverless endpoints
---

Deploying serverless endpoints requires `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` to be defined in the current environment.

**Alternatively**, you can also create a `.secrets.json` file in the root of your project:

```json
{
  "AWS_ACCESS_KEY_ID": "**********************",
  "AWS_SECRET_ACCESS_KEY": "**********************"
}
```

Using this file you can also deploy directly from your development machine without having to export the credentials every time. This file is already ignored by git.

Now, the actual deploying is very straightforward:

```bash
ctra deploy <endpoint-name>
```

This automatically creates a production build and updates your endpoint.

That's it!
