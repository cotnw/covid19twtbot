const Twit = require('twit')
const config = require('./config')
const generateBitlyUrl = require('./bitly')
const mongoose = require('mongoose')
const { TwitterClient } = require('twitter-api-client')
const T = new Twit(config)
const client = new TwitterClient({
    apiKey: process.env.CONSUMER_KEY,
    apiSecret: process.env.CONSUMER_SECRET,
    accessToken: process.env.ACCESS_TOKEN,
    accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
})

const Tweet = require('./models/Tweet')

const db = process.env.MONGODB_URL;

mongoose.connect(db, { useUnifiedTopology: true, useNewUrlParser: true })
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));
mongoose.set('useFindAndModify', false);

const searchKeywords = ['bed', 'beds', 'oxygen', 'ventilator', 'fabiflu', 'remdesivir', 'favipiravar', 'tocilizumab', 'plasma', 'icu', 'icu beds', 'hospital beds', 'rt pcr', 'acterma', 'covid test']
const cities = ["delhi", "mumbai", "kolkata", "bangalore", "chennai", "hyderabad", "pune", "ahmadabad", "surat", "lucknow", "jaipur", "cawnpore", "mirzapur", "nagpur", "ghaziabad", "indore", "vadodara", "vishakhapatnam", "bhopal", "chinchvad", "patna", "ludhiana", "agra", "kalyan", "madurai", "jamshedpur", "nasik", "faridabad", "aurangabad", "rajkot", "meerut", "jabalpur", "thane", "dhanbad", "allahabad", "varanasi", "srinagar", "amritsar", "aligarh", "bhiwandi", "gwalior", "bhilai", "haora", "ranchi", "bezwada", "chandigarh", "mysore", "raipur", "kota", "bareilly", "jodhpur", "coimbatore", "dispur", "guwahati", "solapur", "trichinopoly", "hubli", "jalandhar", "bhubaneshwar", "bhayandar", "moradabad", "kolhapur", "thiruvananthapuram", "saharanpur", "warangal", "salem", "malegaon", "kochi", "gorakhpur", "shimoga", "tiruppur", "guntur", "raurkela", "mangalore", "nanded", "cuttack", "chanda", "dehra dun", "durgapur", "asansol", "bhavnagar", "amravati", "nellore", "ajmer", "tinnevelly", "bikaner", "agartala", "ujjain", "jhansi", "ulhasnagar", "davangere", "jammu", "belgaum", "gulbarga", "jamnagar", "dhulia", "gaya", "jalgaon", "kurnool", "udaipur", "bellary", "sangli", "tuticorin", "calicut", "akola", "bhagalpur", "sikar", "tumkur", "quilon", "muzaffarnagar", "bhilwara", "nizamabad", "bhatpara", "kakinada", "parbhani", "panihati", "latur", "rohtak", "rajapalaiyam", "ahmadnagar", "cuddapah", "rajahmundry", "alwar", "muzaffarpur", "bilaspur", "mathura", "kamarhati", "patiala", "saugor", "bijapur", "brahmapur", "shahjanpur", "trichur", "barddhaman", "kulti", "sambalpur", "purnea", "hisar", "firozabad", "bidar", "rampur", "shiliguri", "bali", "panipat", "karimnagar", "bhuj", "ichalkaranji", "tirupati", "hospet", "aizawl", "sannai", "barasat", "ratlam", "handwara", "drug", "imphal", "anantapur", "etawah", "raichur", "ongole", "bharatpur", "begusarai", "sonipat", "ramgundam", "hapur", "uluberiya", "porbandar", "pali", "vizianagaram", "puducherry", "karnal", "nagercoil", "tanjore", "sambhal", "shimla", "ghandinagar", "shillong", "new delhi", "port blair", "gangtok", "kohima", "itanagar", "panaji", "daman", "kavaratti", "panchkula", "kagaznagar"]

var stream = T.stream('statuses/filter', { track: '@covid19twtbot' })

function replyTextParser(tweetSearchObject, username, originalPosterUsername) {
    replyText = `@${username} @${originalPosterUsername}\nHere's what we found based on your need:\n\n`;

    tweetSearchObject.statuses.forEach(async (tweet, index) => {
        const tweetUrl = 'https://twitter.com/' + tweet.user.screen_name + '/status/' + tweet.id_str;
        const bitlyUrl = await generateBitlyUrl(tweetUrl);
        replyText += String(index + 1) + '. ' + bitlyUrl + '\n'
    });

    replyText += '\nFind more here: https://twitter.com/search?q=' + tweetSearchObject.search_metadata.query + '\nhttps://drive.google.com/drive/folders/1y8fjrbdGEGmcStkNE_Jf5sNRaDCY4zRA'
    return replyText;
}

function tweeted(err, reply) {
    if (err) {
        console.log(err.message);
    } else {
        console.log('Tweeted: ' + reply.text);
    }
}

stream.on('tweet', tweetEvent)

async function tweetEvent(tweet) {
    const tweetText = tweet.text
    if(tweetText.includes('@COVID19twtbot')) {
        if(tweet.in_reply_to_screen_name != 'COVID19twtbot' && tweet.in_reply_to_screen_name != null) {
            console.log("cp1")
            const replyId = tweet.in_reply_to_status_id_str
            const originalTweet = await client.tweets.statusesShow({ id: replyId })
            const originalTweetText = originalTweet.text.toLowerCase()
            console.log("cp2", originalTweetText)
            let moveAhead = false
            searchKeywords.forEach(keyword => {
                if(originalTweetText.includes(keyword)) {
                    moveAhead = true
                } 
            })
            console.log("cp3", moveAhead)
            if(!originalTweetText.includes('needed')) {
                if(!originalTweetText.includes('need')) {
                    moveAhead = false
                }
            }
            console.log("cp4", moveAhead)
            if(moveAhead) {
                let keyWordsArray = []
                searchKeywords.forEach(keyword => {
                    if(originalTweetText.includes(keyword)) {
                        keyWordsArray.push(keyword)
                    }
                })
                if(keyWordsArray.length != 0) {
                    let place = 'place'
                    cities.forEach(city => {
                        if(originalTweetText.includes(city)) {
                            place = city
                        }
                    })
                    if(place != 'place') {
                        let replyItems = '('
                        for (let i = 0; i < keyWordsArray.length; i++) {
                            if (i == keyWordsArray.length - 1) {
                                replyItems = replyItems + keyWordsArray[i] + ')'
                            } else {
                                replyItems = replyItems + keyWordsArray[i] + ' OR '
                            }
                        }
                        let replySearchQuery = 'verified' + ' ' + place + ' ' + replyItems + ' ' + '-need' + ' ' + '-needed' + ' ' + '-required'
                        let response = await client.tweets.search({ q: replySearchQuery, count: 2 })
                        let username = ''
                        let id_str = ''
                        let id = 0
                        let text = ''
                        username = tweet.user.screen_name
                        console.log('https://twitter.com/' + tweet.user.screen_name + '/status/' + tweet.id_str + '\n')
                        id_str = tweet.id_str
                        id = tweet.id
                        text = tweet.text
                        const originalPosterUsername = originalTweet.user.screen_name
                        if (username != '') {
                            let replyText = replyTextParser(response, username, originalPosterUsername)
                            let dbTweet = new Tweet({
                                id: id,
                                id_str: id_str,
                                bot_reply: replyText,
                                link: 'https://twitter.com/' + username + '/status/' + id_str,
                                tweet_str: text
                            })
                            await dbTweet.save()
                            console.log(id, id_str)
                            T.post('statuses/update', { status: replyText, in_reply_to_status_id: id_str }, tweeted)
                        }
                    }
                }
            }
        }
    }
}