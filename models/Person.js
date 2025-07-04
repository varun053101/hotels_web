const mongoose = require('mongoose');

// Define person schema

const personSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true                 // not null
    },

    age : {
        type : Number,
    },

    work : {
        type : String,
        enum : ['chef', 'waiter', 'manager'],
        required : true
    },

    mobile : {
        type : String,
        required : true
    },

    email : {
        type : String,
        required : true,
        unique : true
    },

    address : {
        type : String,
        required : true,
    },

    salary : {
        type : String,
        required : Number
    }

});


// Create Person Model

const Person = mongoose.model('Person', personSchema);
module.exports = Person;