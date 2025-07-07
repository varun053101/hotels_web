const express = require('express')
const app = express()
const port = 3000
const db = require('./db');     // import from exports and also to establish connection befre the establishment of https connection
require('dotenv').config();
const PORT = process.env.PORT || 3000;
const passport = require('./auth');

// bodyParser is a middleware in Express.js
// It used to parse and extract the body of incoming HTTP requestes 
const bodyParser = require('body-parser');
app.use(bodyParser.json());     // stored int req.body

// Middleware Function
const logRequest = (req, res, next) => {
  console.log(`[${new Date().toLocaleString()}] Request Made to : ${req.originalUrl}` );
  next(); // Move on to the next phase
}
app.use(logRequest);


//Initialize passport
app.use(passport.initialize());

// Create an authentication middleware
const localAuthMiddleware = passport.authenticate('local',{session : false});

// Authenticate here
app.get('/', (req, res) => {
  res.send('Welcome to my hotel.... how can i help you?')
})


// Import the router files
const personRoutes = require('./routes/PersonRoutes');
const menuItemRoutes = require('./routes/MenuItemRoutes');

// Use the routers
app.use('/person', localAuthMiddleware, personRoutes);
app.use('/menu', menuItemRoutes);

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})
