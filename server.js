const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const dictionaryRouter = require('./routes/dictionaryRoutes.js');

const app = express();
app.use(express.json());

const uri = 'mongodb+srv://dlarson:wjlO1R9Imcp6iZIF@cluster0-1re7x.gcp.mongodb.net/dictionary?retryWrites=true&w=majority';
const client = mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
try {
    mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }, 
        () => console.log('Connected to database')
    );
}
catch(err) {
    console.log('Failed to connect to database');
}

app.use(dictionaryRouter);

app.listen(3000, () => { console.log('Server is running on port 3000') });