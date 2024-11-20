const express = require('express')
const app = express()
const bodyParser = require('body-parser')
app.use(bodyParser.json())
app.get('/', function (req, res) {
  res.send('Hello World')
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