// // tihis approach is best for making routes 
// // module.exports= (app)=>{
// //     app.post// one problem in this way not me suggestion

// // } 

// other ways is this 

const express = require('express');
const { mongoose } = require('mongoose');
const jwt = require('jsonwebtoken')
const {jwtkey}= require('../keys')
const router = express.Router()
const User = mongoose.model('User');

router.post('/signup', async (req, res) => { 
const body=req.body;
    console.log("req.body",body);
    try{
    const email= body.email;
     const password= body.password;
    const user = new User({email,password})
 await user.save();
const token = jwt.sign({userId:user._id},jwtkey)
res.send({token})
    }
    catch(err){
        res.status(422).send(err.message)
    } 
  });

  router.post('/signin',async(req,res)=>{

const {email,password}=req.body;
if(!email || !password){
  return res.status(422).send({error :"must provide email or password"})
}
  const user = await User.findOne({email})
  if(!user){
    return res.status(422).send({error :"must provide email or password"})
  }
  try{
await user.comparePassword(password);
const token = jwt.sign({userId:user._id},jwtkey)
res.send({token:token})
 
  }
  catch(err){
    return res.status(422).send({error :"must provide email or password"})
  }

  });


module.exports = router

