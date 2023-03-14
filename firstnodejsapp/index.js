
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
mongoose.set('strictQuery', true);
const bcrypt = require('bcrypt')

const app = express();

const PORT=3000; 

require('./models/User')
app.use(bodyParser.json());

const authRoutes= require('./routes/authRoutes')
app.use(authRoutes)
const verifyToken = require('./middleware/verifyToken')
 const {mongoUrl} = require('./keys')
mongoose.connect(mongoUrl,()=>{
  console.log('connected sucess')
});
// mongoose.connection.on('connected',()=>{
//   console.log("connected succes");
//   })
  mongoose.connection.on('error',(err)=>{
    console.log("error a gya",err);
    })

     app.post('/signup', async (req, res) => {

      try{
        const body = req.body;
    
        // there must be a password in body
    
        // we follow these 2 steps
    
        const password = body.password;
    
        var salt = bcrypt.genSaltSync(10);
        var hash = bcrypt.hashSync(password, salt);
    
        body.password = hash;
        console.log('hash - > ', hash);
        const user = new User(body);
    
    
        const result = await user.save();
    
        res.send({
          message: 'Student signup successful'
        });
    
      }
    
      catch(ex){
        console.log('ex',ex)
    
        res.send({
          message: 'Error',
          detail: ex
        }).status(500);
      }
    
      });


        app.post('/login',  async (req, res) => {
          const body = req.body;
          console.log('req.body', body);
      
          const email = body.email;
      
          // lets check if email exists
      
          const result = await User.findOne({"email":  email});
          console.log('result', result);
          if(!result) // this means result is null
          {
            res.status(401).send({
              Error: 'This user doesnot exists. Please signup first'
             });
          }
       else{
            if(body.password===result.password){
              console.log('match')
              res.send( {message: "logging succeful"})
            }
          else{


            console.log('password doesnot match');

            res.status(401).send({message: 'Wrong email or Password'});


          }
          
          }
          
          // 2. if exists, check if password matches
      
      res.send({
       result: result
      });
    
      
        });

        // app.get('/students', async (req, res) => {

        //   const allStudents = await Student.find();
        //   console.log('allStudents', allStudents);
        
        //   res.send(allStudents);
        // })
// app.get('/',verifyToken,(req,res)=>{
//   res.send("your email is "+req.user.email+" and your password"+req.user.password)

// })



  
    

app.listen(PORT,()=>{
  console.log("server running on port"+PORT);
})

