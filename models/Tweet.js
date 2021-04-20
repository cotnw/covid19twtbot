const mongoose = require('mongoose');

const TweetSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true
    },
    id_str: {
        type: String,
        required: true
    },
    bot_reply: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    tweet_text: {
        type: String,
        required: false
    }
})

const Tweet = mongoose.model('Tweet', TweetSchema);

module.exports = Tweet;