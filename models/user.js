const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ['Grass', 'Fire', 'Water', 'Electric', 'Psychic', 'Fighting', 'Darkness', 'Metal', 'Fairy', 'Dragon', 'Colorless'],
        required: true,
    },
    condition: {
        type: String,
        enum: ['Mint', 'Near Mint', 'Excellent', 'Good', 'Light Played', 'Played', 'Poor'],
    },
    cardNum: {
        type: String,
    },
});

const userSchema = new mongoose.Schema({
    username: { 
        type: String,
        required: true,
        unique: true,
     },
    password: {
        type: String,
        required: true,
    },
    cards: [cardSchema],
});

const User = mongoose.model('User', userSchema);
module.exports = User;