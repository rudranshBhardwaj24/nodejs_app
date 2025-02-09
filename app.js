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

const authRouter = require('./src/routes/auth')
const profileRouter = require('./src/routes/profile')
const requestsRouter = require('./src/routes/requests')
const userRouter = require('./src/routes/users')


app.use(cors());
app.use(cookieParser())
app.use(express.json())



const portNumber = 8000

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestsRouter);
app.use("/", userRouter)

// app.route("/games", () => {})

connectDB().then(()=>{
  console.log("Database connection established....")
  app.listen(portNumber, ()=>{
    console.log("Server started on port number: " + portNumber)
  })
}).catch(err => {console.log("Database connection failed....")})