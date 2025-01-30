const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const connectDB = require('./src/config/database')
const User = require('./src/models/user')
const bcrypt = require('bcrypt')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const user = require('./src/models/user')
const jwt = require('jsonwebtoken')


const { default: mongoose, Mongoose } = require('mongoose')
const { validateSingUpData } = require('./src/utils/validation')
const { userAuth } = require('./src/middlewares/auth')


app.use(cors());
app.use(cookieParser())
app.use(express.json())

app.route("/games", () => {})

const portNumber = 8000

//Add user - sign up


//get user
app.get('/user', userAuth, async (req, res) => {
  userAuth;
  try{
  const userData = req.user;
  res.send(userData)}
  catch(err){
    res.send("Unable to get data :(", err)
  }
})

//update user
app.patch('/user', userAuth, async (req, res) => {
  const userId = req.body.userId;
  try{
    const userProfile = await User.findByIdAndUpdate(userId, {
      firstName: req.body.name 
    })
    res.send('User updated!')
  }
  catch(err){
    res.send('could not find the user!')
  }
})

//delete user
app.delete('/user', userAuth, async (req, res) => {
  const userId = req.body.userId
  try{
    const userProfile = await User.findByIdAndDelete({_id: userId})
    console.log(userProfile)
    res.send("User deleted successfully!")
  }
  catch(err){
    res.status(400).json({
      message: "Unable to delete user",
      errorMessage: err.message
    })
  }
})

//find user by id
app.get('/:user-id', async(req, res) => {
  const id = req.params['user-id'];
  const user = await User.findById({_id: id})
  res.send(user)
})

//login user
app.post('/login', async (req, res) => {
  userAuth;
  const{email, password} = req.body;
  const user = await User.findOne({email: email})
  console.log(user)
  const isPasswordCorrect = await bcrypt.compare(password, user.password)
  if(isPasswordCorrect){
  const token = await user.getJWT();
  console.log(user._id)

  if(user){
    res.cookie("token", token);
    res.send("Login successful!");
  }}
  else{
    res.send("Invalid Password");
  }
})

// singup
app.post('/signup', async (req, res) => {
  try{
  //validation of data
  validateSingUpData(req)

  //hash value
  const {firstName, lastName, email, password} = req.body;
  const hashedPassword = await bcrypt.hash(password, 10)

  const user = new User({firstName, lastName, email, password:hashedPassword})
  
  console.log("unhashed password: " + password + "\n" + "hashed password: " + hashedPassword)
  await user.save();
  res.send("User added successfully!")}
  catch(err){
    res.status(400).json({message: "Unable to add user!", err: err.message})
  }
})

app.post('/connectionRequest', userAuth, async(req, res) => {
  const user = await req.user;
  res.send(user.firstName + " has sent a connection request to ")
})

app.get('/', function (req, res) {
  res.send('Hello World')
})

//verify token and show profile
app.get("/profile", userAuth, async (req, res) =>{
  const token = req.cookies.token;
  console.log(token)
  const userId = await jwt.verify(token, "Rudra");
   
  const { _id } =  userId;
  console.log("this is userId:" + _id)
  const user =  await User.findById({_id: _id});
  if(!user){
    res.send("Please log in to get profile")
  }
  else{
  console.log(token)
  res.send(user)}
})

connectDB().then(()=>{
  console.log("Database connection established....")
  app.listen(portNumber, ()=>{
    console.log("Server started on port number: " + portNumber)
  })
}).catch(err => {console.log("Database connection failed....")})