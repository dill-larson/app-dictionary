const express = require('express');
const app = express();

const userModel = require('../schemas/user');
const dictionaryModel = require('../schemas/dictionary');
const wordModel = require('../schemas/word');

app.post('/api/user/login', async (req, res) => {
    userModel.find({
        email : req.body.email, password : req.body.password
    }, function(err, user){
        if(err) throw err;
        if(user.length === 1){  
            return res.status(200).json({
                status: 'success'
                //data: user
            })
        } else {
            return res.status(200).json({
                status: 'fail',
                message: 'Login Failed'
            })
        }
            
    });
});

app.post('/api/user/create', async (req, res) => {
    const user = new userModel({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    });

    try {
        await user.save();
        return res.status(200).json({
            status: 'success',
            //data: user
        });
    } catch(err) {
        res.status(500).send(err);
    }
});

module.exports = app;