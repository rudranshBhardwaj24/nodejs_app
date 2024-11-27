const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const connectDB = require('./src/config/database')
const User = require('./src/models/user')

const cors = require('cors');
const user = require('./src/models/user')
app.use(cors());

const portNumber = 8000

app.use(express.json())

//Add user
app.post('/add-user', async (req, res) => {
  const newUser = new User(req.body)

  try{
  await newUser.save();
  res.send("User added successfully!")}
  catch(err){
    res.status(400).json({message: "Unable to add user!", err: err.message})
  }
})

app.get('/user', async (req, res) => {
  try{
  const userData = await User.find();
  res.send(userData)}
  catch(err){
    res.send("Unable to get data :(", err)
  }
})

app.patch('/user', async (req, res) => {
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

app.delete('/user', async (req, res) => {
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

app.get('/', function (req, res) {
  res.send('Hello World')
})

connectDB().then(()=>{
  console.log("Database connection established....")
  app.listen(portNumber, ()=>{
    console.log("Server started on port number: " + portNumber)
  })
}).catch(err => {console.log("Database connection failed....")})