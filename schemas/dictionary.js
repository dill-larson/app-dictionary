const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dictionarySchema = new Schema({
    name: { type: String, required: true, unique: true },
    owner: { type: String, required: true },
    admins: { type: Array, "default" : [], required: false }, 
    moderators: { type: Array, "default" : [], required: false },
    view: { type: String, required: true}, 
    // tags: { type: Array, "default" : [], required: false },
    words: { type: Array, "default" : [], required: false },
}, { 
  versionKey: false,
  collection : 'dictionaries' 
});
 
const Dictionary = mongoose.model('Dictionary', dictionarySchema);
 
module.exports = Dictionary;