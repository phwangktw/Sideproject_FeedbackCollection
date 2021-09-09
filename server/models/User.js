const mongoose = require('mongoose');
const {Schema} = mongoose;

const userSchema = new Schema({
    googleId: String,
    Name: String
});

mongoose.model('User',userSchema);