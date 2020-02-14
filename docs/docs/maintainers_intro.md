---
id: maintainers_intro
title: Developing Cantara
---

This is for everyone who wishes to contribute to Cantara.

This page is heavily WIP.

## Start development

Create a .env file in the root of the project.
Set the following values:

```
DEV_PROJECT_PATH=path/to/a/cantara/project
DEV_CANTARA_COMMAND=dev app-x
```

Set `DEV_PROJECT_PATH` to a path of a Cantara project. Use `DEV_CANTARA_COMMAND` to simulate a command.
Now run `npm start` to start the development.

## Building cantara

```bash
npm run build
```
