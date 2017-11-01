# Donna
## Online Registration Done Easy

> I’m Donna. I know everything.

**Donna** is the code name for the World Affairs Conference's online registration system. We originally designed this for use with WAC, but in the future we plan to make this modular so any student-led conference (or otherwise) can use our work to make conference registration easy.

We made Donna using a few cool technologies! While we'll get a full list soon, here's a little preview:

* React
* Create-React-App
* Firebase
* Reactstrap
* Font Awesome

Donna is named after Donna Paulsen, the omnipotent secretary from *Suits*.

> I will continue to stay awesome, because I’m Donna.

More documentation is coming soon - we plan to host it on our [documentation site (docs.world.ac)](https://docs.world.ac)

## Getting Started:

We're using Node version 8.4 - pick it up from the Node website or use nvm.

Run the following commands:

```bash
npm run setup
PORT=XXXX npm start
```

Change `XXXX` to your desired port. If you do not set a port the server will default to 3000

When it asks for your Firebase API Key, paste that in. You'll need access to a valid Firebase Plan to run a local instance of this server.

The server will output to `http://127.0.0.1` on the port that you set.
