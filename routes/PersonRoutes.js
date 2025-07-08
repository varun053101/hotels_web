const express = require('express');
const router = express.Router();

const Person = require('./../models/Person');
const {jwtAuthMiddleware, generateToken} = require('./../jwt');
const { compare } = require('bcrypt');
const { json } = require('body-parser');


// Profile Route
router.get('/profile', jwtAuthMiddleware, async (req, res) => {
  try {
    const userData = req.user;
    console.log("User Data: ", userData);

    // Find by id present in userdata
    const userId = userData.id;
    const user = await Person.findById(userId);

    res.status(200).json({user});
  }catch (err){
    console.log(err);
    res.status(500).json({error : 'Internal server error'});
  }
})


// GET method to get the person details

router.get('/', jwtAuthMiddleware, async (req,res) => {
  try{
    const data = await Person.find();
    console.log('data fetched');
    res.status(200).json(data);
  }catch(err){ 
    console.log(err);
    res.status(500).json({error : 'Internal server error'});
  }
})


//POST route to add a person
router.post('/signup', async (req,res) => {
  try{
    // Get the data
    const data = req.body;      // Because the bodyparser stores data in req.body

    // Create a New person
    const newPerson = new Person(data);

    // Save new Person to the database
    const response = await newPerson.save();
    console.log('data saved');

    const payload = {
      id : response.id,
      username : response.username
    }

    console.log(JSON.stringify(payload));

    //Generate the token here
    const token = generateToken(response.username);
    console.log("Token is: ", token);

    res.status(200).json({response : response, token : token});      // 200 is the https code for successful response
  }catch(err){
    console.log(err);
    res.status(500).json({error : 'Internal server error'});
  }
} )

// Login Route
router.post('/login', async (req,res) => {
  try{
    // Extract the username and password from req.body

    const {username, password} = req.body;

    // find the user by username
    const user = await Person.findOne({username : username});

    // If user does not exist or password does not match, return error
    if(!user || !(await user.comparePassword(password))){
      return res.status(401).json({error : 'Invalid username or password'});
    }

    // Generate token
    const payload = {
      id : user.id,
      username : user.username
    }

    const token = generateToken(payload);

    //Return token as response
    return res.json(token);

  }catch(err){
    console.log(err);
    res.status(500).json({error : 'Internal server error'});
  }
})

router.get('/:workType', async (req,res) => {          // ":" makes variable
  try {
    const workType = req.params.workType;   // Extract the work type from the URL parameter

    if(workType == 'chef' || workType == 'manager' || workType == 'waiter'){
      const response = await Person.find({work : workType});
      console.log('data fetched');
      res.status(200).json(response);
    }else{
      res.status(404).json({error : 'Invalid work type'})
    }
  }catch(err){
    console.log(err)
    res.status(404).json({error : 'Invalid work type'})
  }
})

router.put('/:id', async (req,res) => {
  try {

    // Get the persion id
    const personId = req.params.id;

    // get the updation data from the req.body
    const updatedPersonData = req.body;

    //Update the Person data
    const response = await Person.findByIdAndUpdate(personId, updatedPersonData, {
      new : true,             // Return the updated data
      runValidators : true    // Run Mongoose Validation like unique, required etc
    })

    // If the Person id is invalid
    if(!response){
      res.status(404).json({error : 'Invalid work type'})
    }

    console.log('data updated');
    res.status(200).json(response)
  } catch(err) {
    console.log(err);
    res.status(404).json({error : 'Invalid work type'});
  }
})


router.delete('/:id' , async (req,res) => {
  try {
    const personId = req.params.id; // Extract the person's ID from the URL parameter

    // assuming you have the person model
    const response = await Person.findByIdAndDelete(personId);

    if(!response){
      res.status(404).json({error : 'Invalid work type'})
    }

    console.log('data updated');
    res.status(200).json(response)

  } catch (err) {
    console.log(err);
    res.status(404).json({error : 'Invalid work type'});
  }
})

module.exports = router;