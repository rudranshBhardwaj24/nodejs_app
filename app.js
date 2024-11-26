const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const connectDB = require('./src/config/database')
const User = require('./src/models/user')

const cors = require('cors');
app.use(cors());

const portNumber = 8000

app.use(bodyParser.json())

//Add user
app.post('/add-user', async (req, res) => {
  const newUser = new User(req.body)

  try{
  await newUser.save();
  res.send("User added successfully!")}
  catch(err){
    res.status(401).send("Could not save the user! " + err)
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