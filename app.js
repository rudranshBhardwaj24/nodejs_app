const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const cors = require('cors');
app.use(cors());

const dbURI = "mongodb://localhost:27017/games"

app.use(bodyParser.json())

mongoose.connect(dbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("Connected")).catch(console.log("Error connecting"))


const userSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    password: String
  }
)

const User = mongoose.model('User', userSchema);

app.get('/', function (req, res) {
  res.send('Hello World')
})

app.get('/user/:username', async (req, res) => {
  const username = req.params.username
  const user = await User.findOne({name: username})
  console.log(user)
  if(user!=null){
  res.send(user)}
  else{
    res.status(404).send("User not found!")
  }
})

app.get('/login/auth', async (req, res) => {
  const username = req.body.name
  console.log(username)
  
  const password = req.body.password
  console.log(password)
  const usernameCheck = await User.findOne({name: username})
  console.log(usernameCheck)
  if(username == usernameCheck.name && password == usernameCheck.password){
    res.send("Login successful!")
  }
  else{
    res.send("User not found")
  }
})

app.post('/add-user', async (req, res) => {

  const data = req.body;

  const newUserCheck = await User.findOne({name: req.body.name})
  console.log(newUserCheck)

  const newProfile = new User({
    name: data.name,
    email: data.email,
    password: data.password
  })

  if(newUserCheck==null){
  newProfile.save()
  res.send("user added!")
  }
  else{
    res.send("Username already in use! please use a new username")
  }
})

app.get('/login', (req, res) => {
    res.send('Login Page!')
})

app.get('/hello', (req, res) => {
  res.send('Hey!')
})

app.post('/add', (req, res) => {
  try{
    const data = req.body;
    
    res.status(200).json({message:"data received successfully", receivedData: data})
  }

catch{
  console.error();
  res.send("Error")
}})


app.post('')
app.listen(8000)