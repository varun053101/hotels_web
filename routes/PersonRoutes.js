const express = require('express');
const router = express.Router();

const Person = require('./../models/Person');

// GET method to get the person details

router.get('/', async (req,res) => {
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
router.post('/', async (req,res) => {
  try{
    // Get the data
    const data = req.body;      // Because the bodyparser stores data in req.body

    // Create a New person
    const newPerson = new Person(data);

    // Save new Person to the database
    const response = await newPerson.save();
    console.log('data saved');
    res.status(200).json(response);      // 200 is the https code for successful response
  }catch(err){
    console.log(err);
    res.status(500).json({error : 'Internal server error'});
  }
} )



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