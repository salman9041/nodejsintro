const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jsonwebtoken = require('jsonwebtoken');


mongoose.connect("mongodb+srv://salman:11112222@cluster0.wysoumj.mongodb.net/?retryWrites=true&w=majority", {useNewUrlParser: true,useUnifiedTopology:true});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.listen(3000, () => {
  console.log('Express application running on localhost:3000');
});


app.post('/signup', async (req, res) => {
    const body = req.body;
    const password = body.password;
    console.log('req.body', body)
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(password, salt);
    console.log('hash - > ', hash);
    body.password = hash;
      try{
    const authuser = new Authuser(body);
    
    const result = await authuser.save();
    res.send({
      message: 'user signup successful'
    });
      }
      catch(ex){
        console.log('ex',ex);
        res.send({message: 'Error'}).status(401);
      }
    })

    app.post('/login', async (req, res) => {
      try {
        const body = req.body;
    
        const email = body.email;
    
        // lets check if email exists
        const authuser = new Authuser(body);
        const result = await Authuser.findOne({ email: email });
        if (!result) {
          // this means result is null
          res.status(401).send({
            Error: 'This user doesnot exists. Please signup first'
          });
        } else {
          // email did exist
          // so lets match password
    
          if ( bcrypt.compareSync(body.password, result.password)) {
            // great, allow this user access
    
            console.log('match');
            result.password = undefined;
            const token = jsonwebtoken.sign({
              data: body,
              role: 'User'
           }, 'supersecretToken', { expiresIn: '7d' });
   
           console.log('token -> ', token)
   
            res.send({ message: 'Successfully Logged in', token: token });
          } else {
            console.log('password doesnot match');
    
            res.status(401).send({ message: 'Wrong email or Password' });
          }
        }
      } catch (ex) {
        console.log('ex', ex);
      }
    });     
  


    const Authuser = mongoose.model('Authuser', {
      email: String,
      password: String,
    
      
    });