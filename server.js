const express = require('express')
const app = express()
const port = 3000
const db = require('./db');     // import from exports and also to establish connection befre the establishment of https connection

// bodyParser is a middleware in Express.js
// It used to parse and extract the body of incoming HTTP requestes 
const bodyParser = require('body-parser');
app.use(bodyParser.json());     // stored int req.body


app.get('/', (req, res) => {
  res.send('Welcome to my hotel.... how can i help you?')
})


// Import the router files
const personRoutes = require('./routes/PersonRoutes');
const menuItemRoutes = require('./routes/MenuItemRoutes');

// Use the routers
app.use('/person', personRoutes);
app.use('/menu', menuItemRoutes);


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
