const Twit = require('twit')
const config = require('./config')
const mongoose = require('mongoose')
const T = new Twit(config)

const Tweet = require('./models/Tweet')

const db = process.env.MONGODB_URL;

mongoose.connect(db, { useUnifiedTopology: true, useNewUrlParser: true })
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));
mongoose.set('useFindAndModify', false);

const searchKeywords = ['beds', 'oxygen', 'ventilator', 'fabiflu', 'remdesivir', 'favipiravar', 'tocilizumab', 'plasma']
const cities = ["delhi", "mumbai", "kolkata", "bangalore", "chennai", "hyderabad", "pune", "ahmadabad", "surat", "lucknow", "jaipur", "cawnpore", "mirzapur", "nagpur", "ghaziabad", "indore", "vadodara", "vishakhapatnam", "bhopal", "chinchvad", "patna", "ludhiana", "agra", "kalyan", "madurai", "jamshedpur", "nasik", "faridabad", "aurangabad", "rajkot", "meerut", "jabalpur", "thane", "dhanbad", "allahabad", "varanasi", "srinagar", "amritsar", "aligarh", "bhiwandi", "gwalior", "bhilai", "haora", "ranchi", "bezwada", "chandigarh", "mysore", "raipur", "kota", "bareilly", "jodhpur", "coimbatore", "dispur", "guwahati", "solapur", "trichinopoly", "hubli", "jalandhar", "bhubaneshwar", "bhayandar", "moradabad", "kolhapur", "thiruvananthapuram", "saharanpur", "warangal", "salem", "malegaon", "kochi", "gorakhpur", "shimoga", "tiruppur", "guntur", "raurkela", "mangalore", "nanded", "cuttack", "chanda", "dehra dun", "durgapur", "asansol", "bhavnagar", "amravati", "nellore", "ajmer", "tinnevelly", "bikaner", "agartala", "ujjain", "jhansi", "ulhasnagar", "davangere", "jammu", "belgaum", "gulbarga", "jamnagar", "dhulia", "gaya", "jalgaon", "kurnool", "udaipur", "bellary", "sangli", "tuticorin", "calicut", "akola", "bhagalpur", "sikar", "tumkur", "quilon", "muzaffarnagar", "bhilwara", "nizamabad", "bhatpara", "kakinada", "parbhani", "panihati", "latur", "rohtak", "rajapalaiyam", "ahmadnagar", "cuddapah", "rajahmundry", "alwar", "muzaffarpur", "bilaspur", "mathura", "kamarhati", "patiala", "saugor", "bijapur", "brahmapur", "shahjanpur", "trichur", "barddhaman", "kulti", "sambalpur", "purnea", "hisar", "firozabad", "bidar", "rampur", "shiliguri", "bali", "panipat", "karimnagar", "bhuj", "ichalkaranji", "tirupati", "hospet", "aizawl", "sannai", "barasat", "ratlam", "handwara", "drug", "imphal", "anantapur", "etawah", "raichur", "ongole", "bharatpur", "begusarai", "sonipat", "ramgundam", "hapur", "uluberiya", "porbandar", "pali", "vizianagaram", "puducherry", "karnal", "nagercoil", "tanjore", "sambhal", "shimla", "ghandinagar", "shillong", "new delhi", "port blair", "gangtok", "kohima", "itanagar", "panaji", "daman", "kavaratti", "panchkula", "kagaznagar"]


var stream = T.stream('statuses/filter', { track: searchKeywords })

function replyTextParser(tweetSearchObject) {
    replyText = 'Here\'s what we found based on your need:\n\n'
    tweetSearchObject.statuses.forEach((tweet, index) => {
        replyText += String(index + 1) + '. ' + 'https://twitter.com/' + tweet.user.screen_name + '/status/' + tweet.id_str + '\n'
    })
    replyText += '\nFind more here: https://twitter.com/search?q=' + tweetSearchObject.search_metadata.query
    return replyText
}

function tweeted(err, reply) {
    if (err) {
        console.log(err.message);
    } else {
        console.log('Tweeted: ' + reply.text);
    }
}

// ideal reply = verify gurgaon (bed OR beds OR oxygen OR ventilator OR ventilators OR fabiflu)

stream.on('tweet', async(tweet) => {
    const tweetText = tweet.text
    const name = tweet.user.screen_name
    const id = tweet.id_str
    if (tweetText.includes("need") || tweetText.includes("needed")) {
        let replyItems = "("
        let replyPlace = "place"
        const textSplitArray = tweetText.split(" ")
        const keyWordsInTweet = []
        for (let i = 0; i < textSplitArray.length; i++) {
            if (searchKeywords.includes(textSplitArray[i].toLowerCase())) {
                keyWordsInTweet.push(textSplitArray[i].toLowerCase())
            }
        }
        if (keyWordsInTweet.length != 0) {
            for (let i = 0; i < keyWordsInTweet.length; i++) {
                if (i == keyWordsInTweet.length - 1) {
                    replyItems = replyItems + keyWordsInTweet[i] + ')'
                } else {
                    replyItems = replyItems + keyWordsInTweet[i] + ' OR '
                }
            }
        }
        for (let i = 0; i < textSplitArray.length; i++) {
            if (cities.includes(textSplitArray[i].toLowerCase())) {
                replyPlace = textSplitArray[i].toLowerCase()
            }
        }
        if (keyWordsInTweet.length != 0) {
            if (replyPlace != "place") {
                replySearchQuery = 'verified' + ' ' + replyPlace + ' ' + replyItems + ' ' + '-need' + ' ' + '-needed'
                if (!tweet.retweeted_status) {
                    console.log(tweet.text)
                    T.get('search/tweets', { q: replySearchQuery, count: 5 }, (err, data, response) => {
                        let replyText = replyTextParser(data)
                        T.post('statuses/update', { status: replyText, in_reply_to_status_id: tweet.id_str }, tweeted)
                        let dbTweet = new Tweet({
                            id: tweet.id,
                            id_str: tweet.id_str,
                            bot_reply: replyText,
                            link: 'https://twitter.com/' + tweet.user.screen_name + '/status/' + tweet.id_str,
                            tweet_str: tweet.text
                        })
                        dbTweet.save()
                    })

                } else {
                    let dbTweet = await Tweet.findOne({ id: tweet.retweeted_status.id })
                    if (!dbTweet) {
                        console.log(tweet.retweeted_status)
                        T.get('search/tweets', { q: replySearchQuery, count: 5 }, (err, data, response) => {
                            let replyText = replyTextParser(data)
                            T.post('statuses/update', { status: replyTextParser(data), in_reply_to_status_id: tweet.retweeted_status.id_str }, tweeted);
                            let dbTweet = new Tweet({
                                id: tweet.retweeted_status.id,
                                id_str: tweet.retweeted_status.id_str,
                                bot_reply: replyText,
                                link: 'https://twitter.com/' + tweet.retweeted_status.user.screen_name + '/status/' + tweet.retweeted_status.id_str,
                                tweet_str: tweet.retweeted_status.text
                            })
                            dbTweet.save()
                        })
                    }
                }
            }
        }
    }
})