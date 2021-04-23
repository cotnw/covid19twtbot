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

const place = "delhi"
const replyItems = "icu bed"

replySearchQuery = 'verified ' + `${place} (${replyItems})` + ' ' + '-need' + ' ' + '-needed' + ' ' + '-required'
client.tweets.search({ q: replySearchQuery, count: 2 }).then(async (response) => {
    const reply = await replyTextParser(response)
    console.log(reply)
})

function replyTextParser(tweetSearchObject) {
    let replyText = '\nCheck out these tweets for leads: https://twitter.com/search?q=' + tweetSearchObject.search_metadata.query 
    return replyText
}