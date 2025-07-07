const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

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
    },

    username : {
        type : String,
        require : true
    },

    password : {
        type : String,
        required : true
    }

});

// PreMiddleware call
personSchema.pre('save', async function(next){
    const person = this;

    // Hash the password only if it has been modified or its new record
    if(!person.isModified('password'))   return next();
    try{
        //Generate hash password(salting)
        const salt = await bcrypt.genSalt(10);

        // Hash the password
        const hashedPassword = await bcrypt.hash(person.password, salt);    // Both password and salt is stored inside the hashedPassword

        // Override the plain password with the hashed one
        person.password = hashedPassword;

        next();
    }catch(err){
        return next(err);
    }
});

personSchema.methods.comparePassword = async function(candidatePassword){
    try {
        // use bcrypt.compare() to compare the provided password with the hashed password
        const isMatch = await bcrypt.compare(candidatePassword, this.password);
        return isMatch;
    } catch(err) {
        throw err;
    }
}


// Create Person Model

const Person = mongoose.model('Person', personSchema);
module.exports = Person;