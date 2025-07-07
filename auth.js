// sets up Passport with a local authentication strategy, using a Person model for username and passowrd

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Person = require('./models/Person');

// Implement Local Authentication Strategy
passport.use(new LocalStrategy(async (USERNAME, password, done) => {
  // authentication logic here
  try {
    // console.log('Recieved Credentials: ',USERNAME,password);
    const user = await Person.findOne({username : USERNAME});

    if(!user){
      // done takes 3 parameters: done(error, user, info);
      // if authentication fails
      return done(null, false, {message : 'Incorrect UserName'});
    }

    // const isPasswordMatch = user.password === password ? true : false;      // for unhashed passwords
    const isPasswordMatch = await user.comparePassword(password);           // calls a function for comparing password with hashed password

    if(isPasswordMatch){
      // Authentication successful
      return done(null,user);
    } else {
      // Password not matched
      return done(null, false, {message : 'Invalid Password'});
    }
  }catch(err){
    return done(err);
  }
}))

module.exports = passport;
