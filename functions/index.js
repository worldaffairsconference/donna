//import libraries
const functions = require('firebase-functions');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const { ref, firebaseAuth } = require('./constants.js');

// Graphql schema
const schema = buildSchema(`
  type Query {
  }
`);

const root = {};

//initialize express server
const app = express();

app.use(
  '/',
  graphqlHTTP({
    schema: schema,
    rootValue: root,
  })
);

//define google cloud function name
const graphql = functions.https.onRequest(app);

module.exports = {
  graphql,
};
