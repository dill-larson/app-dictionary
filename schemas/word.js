const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const wordSchema = new Schema({
    name: { type: String, required: true},
    wordFunction: { type: String, required: true}, 
}, { 
  versionKey: false,
  collection : 'dictionaries' 
});
 
const Word = mongoose.model('Word', wordSchema);
 
module.exports = Word;