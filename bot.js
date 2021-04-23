const Twit = require('twit')
const config = require('./config')
const { TwitterClient } = require('twitter-api-client')
const T = new Twit(config)
const client = new TwitterClient({
    apiKey: process.env.CONSUMER_KEY,
    apiSecret: process.env.CONSUMER_SECRET,
    accessToken: process.env.ACCESS_TOKEN,
    accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
})

const searchKeywords = ['bed', 'beds', 'oxygen', 'ventilator', 'fabiflu', 'remdesivir', 'favipiravar', 'tocilizumab', 'plasma', 'icu', 'icu beds', 'hospital beds', 'rt pcr', 'acterma', 'covid test']
const cities = ["gurgaon", "delhi", "kanpur", "mumbai", "kolkata", "bangalore", "chennai", "hyderabad", "pune", "ahmadabad", "surat", "lucknow", "jaipur", "cawnpore", "mirzapur", "nagpur", "ghaziabad", "indore", "vadodara", "vishakhapatnam", "bhopal", "chinchvad", "patna", "ludhiana", "agra", "kalyan", "madurai", "jamshedpur", "nasik", "faridabad", "aurangabad", "rajkot", "meerut", "jabalpur", "thane", "dhanbad", "allahabad", "varanasi", "srinagar", "amritsar", "aligarh", "bhiwandi", "gwalior", "bhilai", "haora", "ranchi", "bezwada", "chandigarh", "mysore", "raipur", "kota", "bareilly", "jodhpur", "coimbatore", "dispur", "guwahati", "solapur", "trichinopoly", "hubli", "jalandhar", "bhubaneshwar", "bhayandar", "moradabad", "kolhapur", "thiruvananthapuram", "saharanpur", "warangal", "salem", "malegaon", "kochi", "gorakhpur", "shimoga", "tiruppur", "guntur", "raurkela", "mangalore", "nanded", "cuttack", "chanda", "dehra dun", "durgapur", "asansol", "bhavnagar", "amravati", "nellore", "ajmer", "tinnevelly", "bikaner", "agartala", "ujjain", "jhansi", "ulhasnagar", "davangere", "jammu", "belgaum", "gulbarga", "jamnagar", "dhulia", "gaya", "jalgaon", "kurnool", "udaipur", "bellary", "sangli", "tuticorin", "calicut", "akola", "bhagalpur", "sikar", "tumkur", "quilon", "muzaffarnagar", "bhilwara", "nizamabad", "bhatpara", "kakinada", "parbhani", "panihati", "latur", "rohtak", "rajapalaiyam", "ahmadnagar", "cuddapah", "rajahmundry", "alwar", "muzaffarpur", "bilaspur", "mathura", "kamarhati", "patiala", "saugor", "bijapur", "brahmapur", "shahjanpur", "trichur", "barddhaman", "kulti", "sambalpur", "purnea", "hisar", "firozabad", "bidar", "rampur", "shiliguri", "bali", "panipat", "karimnagar", "bhuj", "ichalkaranji", "tirupati", "hospet", "aizawl", "sannai", "barasat", "ratlam", "handwara", "drug", "imphal", "anantapur", "etawah", "raichur", "ongole", "bharatpur", "begusarai", "sonipat", "ramgundam", "hapur", "uluberiya", "porbandar", "pali", "vizianagaram", "puducherry", "karnal", "nagercoil", "tanjore", "sambhal", "shimla", "ghandinagar", "shillong", "port blair", "gangtok", "kohima", "itanagar", "panaji", "daman", "kavaratti", "panchkula", "kagaznagar"]

var stream = T.stream('statuses/filter', { track: ['@COVID19twtbot', '@COVID19twtbot1'] })

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
    if(tweetText.includes('@COVID19twtbot') || tweetText.includes('@COVID19twtbot1')) {
        if(tweet.in_reply_to_screen_name != 'COVID19twtbot' &&  tweet.in_reply_to_screen_name != 'COVID19twtbot1' && tweet.in_reply_to_screen_name != null) {
            console.log("cp1")
            const replyId = tweet.in_reply_to_status_id_str
            const originalTweet = await client.tweets.statusesShow({ id: replyId, tweet_mode: 'extended' })
            const originalTweetText = originalTweet.full_text.toLowerCase()
            console.log("cp2", originalTweetText)
            let moveAhead = false
            searchKeywords.forEach(keyword => {
                if(originalTweetText.includes(keyword)) {
                    moveAhead = true
                } 
            })
            console.log("cp3", moveAhead)
            if(moveAhead) {
                let keyWordsArray = []
                searchKeywords.forEach(keyword => {
                    if(originalTweetText.includes(keyword)) {
                        keyWordsArray.push(keyword)
                    }
                })
                console.log("cp4", keyWordsArray)
                if(keyWordsArray.length != 0) {
                    let place = 'place'
                    console.log(originalTweetText)
                    cities.forEach(city => {
                        if(originalTweetText.includes(city)) {
                            place = city
                        }
                    })
                    console.log("cp5", place)
                    if(place != 'place') {
                        let replyItems = '('
                        for (let i = 0; i < keyWordsArray.length; i++) {
                            if (i == keyWordsArray.length - 1) {
                                replyItems = replyItems + keyWordsArray[i].replace(" ", "%20") + ')'
                            } else {
                                replyItems = replyItems + keyWordsArray[i].replace(" ", "%20") + '%20OR%20'
                            }
                        }
                        let replySearchQuery = 'verified' + '%20' + place + '%20' + replyItems + '%20' + '-need' + '%20' + '-needed' + '%20' + '-required&f=live'
                        let username = tweet.user.screen_name
                        const originalPosterUsername = originalTweet.user.screen_name
                        console.log('https://twitter.com/' + tweet.user.screen_name + '/status/' + tweet.id_str + '\n')
                        let replyText = `@${username} @${originalPosterUsername}\nCheck out these tweets for leads:\nhttps://twitter.com/search?q=${replySearchQuery}`
                        if (username != '') {
                            console.log("cp6", replyText)
                            T.post('statuses/update', { status: replyText, in_reply_to_status_id: tweet.id_str }, tweeted)
                        }
                    }
                }
            }
        }
    }
}
