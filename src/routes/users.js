const express = require('express');
const { userAuth } = require('../middlewares/auth');
const user = require('../models/user');
const connectionRequest = require('../models/connectionRequest');
const { connections } = require('mongoose');
const userRouter = express.Router();

// review requests
userRouter.get('/request/view', userAuth, async (req, res) => {

    const loggedInUser = await req.user;
    console.log(loggedInUser._id)

    const connectionRequestCollection = await connectionRequest.find({
        toUserId: loggedInUser._id,
        status: "interested"
    }).populate("fromUserId",["firstName", "lastName"])

    if(!connectionRequestCollection){
        return res.json({
            message: "No connection request found"
        })
    }
    
    return await res.send(connectionRequestCollection);

})

// view your friends list
userRouter.get('/view/connections', userAuth, async (req, res) => {
    const loggedInUser = req.user;

    const connections = await connectionRequest.find({
        $or : [{
        toUserId: loggedInUser._id,
        status: "accept"},
        {
            fromUserId: loggedInUser._id,
            status: "accept"}
        ]
    }).populate("fromUserId",["firstName", "lastName"]).populate("toUserId", ["firstName", "lastName"])


    console.log(connections)
    if(!connections || connections.length==0){
        return res.send("No friends found")
    }

    const friends = connections.map(key => {
        if(loggedInUser._id==key.fromUserId){
            console.log(typeof(key.fromUserId) + "type of loggedIn" + loggedInUser._id)
            return key.fromUserId;}
           
        
        else{
            console.log(typeof(key.fromUserId) + "type of loggedIn" + loggedInUser._id)
            
            return key.toUserId;
        }
})
        
    return res.send(friends);
})

// user feed
userRouter.get("/user/feed", userAuth, async (req, res) => {

    loggedInUser = req.user;
    const users = await user.find()

    const connectionRequests = await connectionRequest.find({
        $or: [
            {toUserId: loggedInUser._id},
            {fromUserId: loggedInUser._id}
        ]
    }).select("fromUserId toUserId");

    const hideUsersFromFeed = new Set();

    connectionRequests.forEach( req => {
    hideUsersFromFeed.add(req.fromUserId.toString())
    hideUsersFromFeed.add(req.toUserId.toString())})

    console.log(hideUsersFromFeed)

    const userFeed = await user.find({ $and: [
        {_id: {$nin: Array.from(hideUsersFromFeed)}},
        {_id: {$ne: loggedInUser._id}}
    ]})

    return res.send(userFeed);
})

module.exports = userRouter