const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

//const User = require('./schema/user');
//const Dictionary = require('./schema/dictionary');
//const Word = require('./schema/word');

const app = express();

const uri = 'mongodb+srv://dlarson:lDDUhxoSqHuR9cdM@cluster0-1re7x.gcp.mongodb.net/dictionary?retryWrites=true&w=majority';
try{
    mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }, () =>
console.log("connected to database."));
} catch(err) {
    console.log("failed to connected to database.");
}

console.log("Hello World!");