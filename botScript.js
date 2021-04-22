const Twit = require('twit')
const config = require('./config')
const mongoose = require('mongoose')
const { TwitterClient } = require('twitter-api-client')
const T = new Twit(config)
const client = new TwitterClient({
    apiKey: process.env.CONSUMER_KEY,
    apiSecret: process.env.CONSUMER_SECRET,
    accessToken: process.env.ACCESS_TOKEN,
    accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
})

const place = "lucknow"
const replyItems = "oxygen"

replySearchQuery = 'verified ' + `${place} (${replyItems})` + ' ' + '-need' + ' ' + '-needed' + ' ' + '-required'
client.tweets.search({ q: replySearchQuery, count: 2 }).then(async (response) => {
    const reply = await replyTextParser(response)
    console.log(reply)
})

function replyTextParser(tweetSearchObject) {
    replyText = `Here's what we found based on your need:\n\n`
    tweetSearchObject.statuses.forEach((tweet, index) => {
        replyText += String(index + 1) + '. ' + 'https://twitter.com/' + tweet.user.screen_name + '/status/' + tweet.id_str + '\n'
    })
    replyText += '\nFind more here: https://twitter.com/search?q=' + tweetSearchObject.search_metadata.query + '\nhttps://drive.google.com/drive/folders/1y8fjrbdGEGmcStkNE_Jf5sNRaDCY4zRA'
    return replyText
}