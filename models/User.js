const mongoose = require('mongoose');
const { Schema } = mongoose; //const Schema = mongoose.Schema; are same

const userSchema = new Schema({
    googleID: String,
    name: String
});

mongoose.model('users', userSchema);//two arguments means insert the value.