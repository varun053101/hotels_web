const mongoose = require('mongoose');

// Define the MongoDB connection URL
const mongoURL = 'mongodb://localhost:27017/hotels'   // Automatically creats a new database if not already present

mongoose.connect(mongoURL);             // Represent that the url that we are working is new with latest mongodb version

// mongoose.connect(mongoURL, {
//     useNewUrlParser : true,                 // Represent that the url that we are working is new with latest mongodb version
//     useUnifiedTopology : true
// });


// Get default connection
// mongoose maintains a default connection object representing the MongoDB connection
const db = mongoose.connection;     // this object is what we will use to handle events and interact with the database

// Define event Listeners
db.on('connected', () => {
    console.log('Connected to MongoDB Server');
});

db.on('error', (err) => {
    console.log('MongoDB Connection error: '+ err);
});

db.on('disconnected', () => {
    console.log('MongoDB Disconnected');
});

// Export the database connection

module.exports = db;            // exporting so that express can use it to interact with the database






