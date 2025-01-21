const express = require('express');
const authRouter = express.Router;

app.post('/signup', async (req, res) => {
    const newUser = new User(req.body)
    const {password}  = newUser;
    const hashedPassword = await bcrypt.hash(password, 10)
    
    try{
      console.log("unhashed password: " + password + "\n" + "hashed password: " + hashedPassword)
    await newUser.save();
    res.send("User added successfully!")}
    catch(err){
      res.status(400).json({message: "Unable to add user!", err: err.message})
    }
  })