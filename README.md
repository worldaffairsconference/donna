# Donna

## Online Registration Done Easy

> I’m Donna. I know everything.

**Donna** is the code name for the [World Affairs Conference](http://worldaffairs.ucc.on.ca/)'s online registration system. We originally designed Donna for this conference, but it could be modified easily to be used for other student-led conferences to make registration easy and customizable.

Donna is named after Donna Paulsen, the omnipotent secretary from _Suits_.

> I will continue to stay awesome, because I’m Donna.

More documentation is coming soon in this `README` file.

## Features

Donna was created by students at Upper Canada College running registration for their annual current affairs conference.

Each year, ~1000 students from the Greater Toronto Area register this conference through their teachers. This pose a difficult challenge since we need to collect lots of information such as sessions they prefer, dietary restrictions, accommodations, payment status, etc. We got tired of processing endless emails and mails, and decided to create a customized digital system for this.

Through Donna, we can automate many of these processes:

1. Teacher from each school register an account.
2. Teacher can view important communication through their portal such as registration deadline.
3. Teacher can register students along with important information such as student's name, year, preferred panels, and accommodation.
4. Teacher can view the status of their payment (updated by us after receiving the cheque).
5. Teacher can delete students as well as their own account, no related records will be kept in our database.

With the data stored in our database in `JSON` format, we can easily run algorithms to generate name tags, plan the time and room distribution for sessions, and gain insights in our attendee's interests. You can find the set of scripts [here](https://github.com/worldaffairsconference/scripts).

## Production & Deployment

This system has been used for World Affairs Conference since 2018, handling registration from hundreds of conference attendees.
You can check out the live deployed version of this system at [https://worldaffairsconference.github.io/donna/](https://worldaffairsconference.github.io/donna/).

Currently, the deployment environment is GitHub pages.

## Tech Stack

We made Donna using a few cool technologies!

- React
- Create-React-App
- Firebase Realtime Database
- Reactstrap
- Font Awesome

The reason we chose `React + Firebase` is that we think the React's state management and Firebase's real-time synchronization makes this system very smooth to develop and reliable to deploy.

## Program Structure

The particular set up of this project allow module bundling with webpack, abstracting of helper functions, and access control of authorized vs unauthorized users.

    - src/
      - components/
        - img/ -- resources for webpack bundling
        - protected/ -- authorized components
        - *.js -- public components
      - config/
        - config.json -- content configuration
        - constants.js -- API credential (gitignored)
      - helpers/
        - auth.js -- firebase authentication methods
      - index.js
      - index.css
      - App.test.js -- Jasmine testing script (TO-DO)
      - setup.sh -- set up API credentials

**Design considerations**

We use customized components to generate UI representing data response. For example, we add a `StudentRow` component for every student, using data passed from parent component via `props`.

We use internal `states` often for form data field validation. For example, see `AddStudent`.

We set up real-time listeners at references of the firebase database. Once there is an update on the data, we will re-render the portal. See `DashBoard`.

## Getting Started

We originally developed this application with node `v8.4`. The app works with LTS as well (May 2020, `v12.16.3`). Currently the application is being tested on node `v12.21.0` to comply with `Firebase Cloud Functions`.

Set up your node environment using default global node version or nvm.

Run the following commands:

```bash
yarn run setup # Set up firebase API credentials for local testing
yarn install # Install node packages
./port # if you want to change the port, defaulted at Port 3000
yarn start
```

When it asks for your Firebase API Key, paste that in. You'll need access to a valid Firebase set up. The spark (free) plan should work. Please make sure that the `JSON` is a single line.

The server will output to `http://127.0.0.1` on the port that you set (default 3000).

To modify the system to fit your conference's needs, feel free modify the parameters in `config/config.json` and update the logic of protected components.

## Deployment

`Github Actions` is already setup for this repository. Make sure to test thoroughly on local host before commiting and pushing. The `Actions` is set up like so:

- If a change is made to the `/src` or `/public` directory, the Action will build and deploy the application to `gh-pages`.
- Any code outside of the two directories will not trigger the deployment.
- The remote `Firebase Config File` is stored as a `Github Secret`. You can only update it with a new value under `Settings`

## Contributor and Maintainer

Donna was originally created by [Simon Guo](https://github.com/simonguozirui) and [Nicholas O'Brien](https://github.com/obrien66), mentored by [Matthew Wang](https://github.com/malsf21).

Previously maintained by [Robert Knowles](https://github.com/rbrtknwls).

Currently maintained and developed by [Jefferson Ding](https://github.com/jeffersonucc)

## TO-DO

There are many part of this code that can be refactored into more functions and components.

#### Program logic fix

- [x] Remove forced refresh when data is updated.
- [ ] Move Firebase request to a async library function. Call it in `componentDidMount` rather than in constructor.
- [ ] Make sure all states are set up with initialed data and then updated using `setState`.
- [ ] **Replace bind with arrow function/ES6 anonymous functions to ensure `this` keyword reference.**

#### Better modulization of components

- [ ] Reduce redundancies of similar JSX elements in `render()` using `map` and `forEach`, identified through `prop`.
- [ ] Use `Redux` to contain states.

#### Upgrade React component & dependencies to newer versions.

- [x] Upgrade router from `hashHistory` to `HashRouter`.

#### Better program structure and folder organization.

- [ ] Common `Shared/` folder to add tests.
- [ ] Set up Component subfolder that is named by the main component it contains.

#### Automated Testing, Integration, Deployment

- [ ] Set up static test pipeline. Using `Jest` and `Enzyme` to mock a call to a function, returning static data that represents snapshot of supposed behavior.
- [x] Set up proper CI pipeline.
- [x] Set up CD in `Github Actions` and manage API key credentials through `Github Secrets`.

#### UI/UX Improvements

- [ ] Accessibility tab select key operations.
- [ ] Card view table in mobile view.
- [ ] Color code icons to replace long texts.
- [ ] Make dashboard information viewable in one screen without scrolling horizontally in mobile view.
- [ ] Fix Navbar alignment.

## Future Features

- [ ] Individual Registration Portal
- [ ] Email confirmation of registration, automate pre-deadline reminder
- [ ] Fee calculation based on number of registered students
- [ ] Payment integration (Stripe API)
- [ ] Confirmation of payments, lock-in registrations
- [ ] Batch upload from CSV
