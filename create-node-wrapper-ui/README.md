# AI-model-evaluator
This has become the Platform of reference for implementing Machine Learning Graphical Representations.

It's main arsenal is a set of UI components ranging from ***Charts***, to ***Geolocated Maps***, ***Text annotations*** and ***Interactive Tables***.

It offers authentication with extended onboarding functionality.

<u>The main libraries and concepts are:</u>

## React
This project relies heavily on the **React library** and it's state management pattern.

Our main source of reference is the [Official React Documentation](https://reactjs.org/docs/getting-started.html).

The use of **Hooks** and **Function Components** as introduced in v. 16.8 is **mandatory**.

## State Management
The main **local** state management tool is the [**useState**](https://reactjs.org/docs/hooks-state.html) and **useEffect** API.

The best resource for understanding the **render cycle** of a functional component with useEffect is the

[Complete Guid to **useEffect** by Dan Abramov](https://overreacted.io/a-complete-guide-to-useeffect/)

The main strategy of fetching data with React Hooks follows the example of Robin Wieruch blog post:

[How to **fetch data** with React Hooks?](https://www.robinwieruch.de/react-hooks-fetch-data)

[How to cancel a request in useEffect](https://dev.to/iquirino/react-hook-clean-up-useeffect-24e7)

When a more complex local state management is required, the [**useReducer**](https://reactjs.org/docs/hooks-reference.html#usereducer) hook comes to play.

For global state management in order to avoid nested state passed down with props, the [**useContext**](https://reactjs.org/docs/hooks-reference.html#usecontext) hook is utilized.

*An alternative global state management library under consideration is [**Recoil**](https://recoiljs.org/) (made by facebook again)*.

## Create React App (CRA)
Create React App is a comfortable environment for developing with React, and is the best way to start building a new single-page application.

It sets up your development environment so that you can use the latest JavaScript features, provides a nice developer experience, and optimizes your app for production.

You’ll need to have Node 8.16.0 or Node 10.16.0 or later version on your local development machine (but it’s not required on the server). You can use nvm (macOS/Linux) or nvm-windows to switch Node versions between different projects.

```sh
npm install

npm start
```

[Create React App Getting Started](https://create-react-app.dev/docs/getting-started)

## Craco
Create react app offers a lot of development functionality with one caveat. We cannot customize **webpack** configuration without ejecting the app (and loosing any future upgrade).
In order to extend our build functionality we use the [**C**reate **R**eact **A**pp **C**onfiguration **O**verride  (**Craco**)](https://github.com/gsoft-inc/craco) layer.

## Feature Toggle

AI-model-evaluator is a collection of different implementations for different clients.

With the use of Webpack configuration we create **custom builds** which include only the absolutely necessary parts of the code, excluding branches of unrelated components.

The customization is set in the **production.config.json** file (excluded from github) placed inside the ***config/craco*** folder. (you should ask for it when developing)
A base representation of it's default values is found in ***development.config.json***.

## Material UI

The project follows **Google's Material Design** and **Material-UI** components library in particular.

We currently utilize **v.3**

Main resource is the: [Official v3 **Material UI Documentation**](https://v3.material-ui.com/)

## Recharts

This is our main charting library.
Documentation can be found here: [Recharts API](https://recharts.org/en-US/api)

Mind you that for almost all cases a custom more sophisticated chart component is extending functionality of a base recharts (or other) component. Search for existing implimentations before creating one from scratch.

## Github Strategy

### Flow
GitHub flow is a lightweight, branch-based workflow that supports teams and projects where deployments are made regularly. This guide explains how and why GitHub flow works.

[Github Guides: Flow](https://guides.github.com/introduction/flow)

[Github Workflow Strategies](https://www.youtube.com/watch?v=aJnFGMclhU8)

### Best Practices

GitHub's own best practices videos collection. Talking about managing projects, creating workflows, Continuous Integration and Continuous Delivery.

[Github Resources: Best Practices](https://resources.github.com/videos/github-best-practices)

[Github Docs: Linking a pull request to an issue using a keyword](https://docs.github.com/en/github/managing-your-work-on-github/linking-a-pull-request-to-an-issue#linking-a-pull-request-to-an-issue-using-a-keyword)

## Code styling
We follow the Airbnb's Eslint rules with minor customizations found in .eslintrc.js
As an example single quotes are preffered to double ones.

To comply to these rules, we recomend the **ESLint** extension from Dirk Baeumer for VS Code Editor.
You may need to install ESLint locally:
```sh
npm install eslint
```
or globally:
```sh
npm install -g eslint
```


testing to make sure that playground is working
