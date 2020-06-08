const path = require('path')
if (process.env.NODE_ENV !== 'production') require("dotenv").config({ 
    path: path.resolve(__dirname, `../config/${process.env.NODE_ENV}.env`)
});

const express = require('express');
const jwt  = require('jsonwebtoken')


const sessions = require('../../data/activeSessions')

const host = new express.Router();

const createID = (name) => {
    return _id = jwt.sign({name},process.env.JWT_SECRET_KEY);
}

host.get('/host', async (req, res) => {
    console.log('GET request for /host received.\nProceeding to generate cool, unique room id to be returned as response.');
    
    const roomName = req.query.roomname
    if(!roomName){
        return {error: 'Please enter room name.'}
    }
    console.log(req.query)
    const _id = createID(req.query.roomname);
    sessions.push(_id);
    console.log(sessions)
    res.send({_id:_id});
})


module.exports = host;
