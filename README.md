# Donna
## Online Registration Done Easy

> I’m Donna. I know everything.

**Donna** is the code name for the [World Affairs Conference](http://worldaffairs.ucc.on.ca/)'s online registration system. We originally designed Donna for this conference, but it could be modified easily to be used for other student-led conferences to make registration easy and customizable.

Donna is named after Donna Paulsen, the omnipotent secretary from *Suits*.

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
You can check out the live deployed version of this system at [https://worldaffarisregistration.github.io/](https://worldaffarisregistration.github.io/).

## Tech Stack
We made Donna using a few cool technologies!
* React
* Create-React-App
* Firebase
* Reactstrap
* Font Awesome

The reason we chose `React + Firebase` is that we think the React's state management and Firebase's real-time synchronization makes this system very smooth to develop and reliable to deploy.

## Program Structure
The particular set up allow module bundling with webpack. 

We set up real-time listeners at references of the firebase database. Once there is an update on the data, we will re-render the portal.

TBA


## Getting Started

We originally developed this application with node `v8.4`. The app works with LTS as well (May 2020, `v12.16.3`).

Set up your node environment using default global node version or nvm.

Run the following commands:

```bash
npm run setup # Set up firebase API credentials 
npm install # Install node packages
./port # if you want to change the port, defaulted at Port 3000
npm start
```

When it asks for your Firebase API Key, paste that in. You'll need access to a valid Firebase Plan to run a local instance of this server.

The server will output to `http://127.0.0.1` on the port that you set.

## Contributor and Maintainer
Donna was originally created by [Simon Guo](https://github.com/simonguozirui) and [Nicholas O'Brien](https://github.com/obrien66), mentored by [Matthew Wang](https://github.com/malsf21). 

It is currently maintained by [Robert Knowles](https://github.com/rbrtknwls).

## TO-DO
* Better modulization of components
* Upgrade dependencies to newer versions
* ES-lint integration
* Set up CI/CD, replacing ad-hoc manual testing with automatic testing
* Manage API keys through `.env`