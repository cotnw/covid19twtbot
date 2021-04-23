const needle = require('needle');
const Twit = require('twit')
const config = require('./config')
require('dotenv').config()

const token = process.env.BEARER_TOKEN
const T = new Twit(config)

const rulesURL = 'https://api.twitter.com/2/tweets/search/stream/rules';
const streamURL = 'https://api.twitter.com/2/tweets/search/stream';

const rules = [
    {
        'value': '@covid19twtbot',
    },
];

async function getAllRules() {

    const response = await needle('get', rulesURL, {
        headers: {
            "authorization": `Bearer ${token}`
        }
    })

    if (response.statusCode !== 200) {
        console.log("Error:", response.statusMessage, response.statusCode)
        throw new Error(response.body);
    }

    return (response.body);
}

async function deleteAllRules(rules) {

    if (!Array.isArray(rules.data)) {
        return null;
    }

    const ids = rules.data.map(rule => rule.id);

    const data = {
        "delete": {
            "ids": ids
        }
    }

    const response = await needle('post', rulesURL, data, {
        headers: {
            "content-type": "application/json",
            "authorization": `Bearer ${token}`
        }
    })

    if (response.statusCode !== 200) {
        throw new Error(response.body);
    }

    return (response.body);

}

async function setRules() {

    const data = {
        "add": rules
    }

    const response = await needle('post', rulesURL, data, {
        headers: {
            "content-type": "application/json",
            "authorization": `Bearer ${token}`
        }
    })

    if (response.statusCode !== 201) {
        throw new Error(response.body);
    }

    return (response.body);

}

function createReplyText(text, u1, u2) {
    const tweetText = text.toLowerCase();
    const searchKeywords = ['bed', 'beds', 'oxygen', 'ventilator', 'fabiflu', 'remdesivir', 'favipiravar', 'tocilizumab', 'plasma', 'icu', 'icu beds', 'hospital beds', 'rt pcr', 'acterma', 'covid test', 'itolizumab', 'fapvir', 'faviblu', 'flugard', 'fevindo', 'araflu', 'avigan', 'favilow', 'favipill', 'cipvir']
    const cities = ["gurgaon", "noida", "dehradun", "delhi", "kanpur", "mumbai", "kolkata", "bangalore", "chennai", "hyderabad", "pune", "ahmadabad", "surat", "lucknow", "jaipur", "cawnpore", "mirzapur", "nagpur", "ghaziabad", "indore", "vadodara", "vishakhapatnam", "bhopal", "chinchvad", "patna", "ludhiana", "agra", "kalyan", "madurai", "jamshedpur", "nasik", "faridabad", "aurangabad", "rajkot", "meerut", "jabalpur", "thane", "dhanbad", "allahabad", "varanasi", "srinagar", "amritsar", "aligarh", "bhiwandi", "gwalior", "bhilai", "haora", "ranchi", "bezwada", "chandigarh", "mysore", "raipur", "kota", "bareilly", "jodhpur", "coimbatore", "dispur", "jhunjhunu", "guwahati", "solapur", "trichinopoly", "hubli", "jalandhar", "bhubaneshwar", "bhayandar", "moradabad", "kolhapur", "thiruvananthapuram", "saharanpur", "warangal", "salem", "malegaon", "kochi", "gorakhpur", "shimoga", "tiruppur", "guntur", "raurkela", "mangalore", "nanded", "cuttack", "chanda", "dehra dun", "durgapur", "asansol", "bhavnagar", "amravati", "nellore", "ajmer", "tinnevelly", "bikaner", "agartala", "ujjain", "jhansi", "ulhasnagar", "davangere", "jammu", "belgaum", "gulbarga", "jamnagar", "dhulia", "gaya", "jalgaon", "kurnool", "udaipur", "bellary", "sangli", "tuticorin", "calicut", "akola", "bhagalpur", "sikar", "tumkur", "quilon", "muzaffarnagar", "bhilwara", "nizamabad", "bhatpara", "kakinada", "parbhani", "panihati", "latur", "rohtak", "rajapalaiyam", "ahmadnagar", "cuddapah", "rajahmundry", "alwar", "muzaffarpur", "bilaspur", "mathura", "kamarhati", "patiala", "saugor", "bijapur", "brahmapur", "shahjanpur", "trichur", "barddhaman", "kulti", "sambalpur", "purnea", "hisar", "firozabad", "bidar", "rampur", "shiliguri", "bali", "panipat", "karimnagar", "bhuj", "ichalkaranji", "tirupati", "hospet", "aizawl", "sannai", "barasat", "ratlam", "handwara", "drug", "imphal", "anantapur", "etawah", "raichur", "ongole", "bharatpur", "begusarai", "sonipat", "ramgundam", "hapur", "uluberiya", "porbandar", "pali", "vizianagaram", "puducherry", "karnal", "nagercoil", "tanjore", "sambhal", "shimla", "ghandinagar", "shillong", "port blair", "gangtok", "kohima", "itanagar", "panaji", "daman", "kavaratti", "panchkula", "kagaznagar"]
    let moveAhead = false
    searchKeywords.forEach(keyword => {
        if(tweetText.includes(keyword)) {
            moveAhead = true
        } 
    })
    if(!moveAhead) { return `@${u1} @${u2} The bot can't find any keyword in the tweet` }
    const keyWordsArray = []
    searchKeywords.forEach(keyword => {
        if(tweetText.includes(keyword)) {
            keyWordsArray.push(keyword)
        }
    })
    if(keyWordsArray.length == 0) { return `@${u1} @${u2} The bot can't find any keyword in the tweet`}
    let place = 'none'
    cities.forEach(city => {
        if(tweetText.includes(city)) {
            place = city
        }
    })
    if(place == 'none') { return `@${u1} @${u2} The bot can't find the name of the place` }
    let replyItems = '('
    for (let i = 0; i < keyWordsArray.length; i++) {
        if (i == keyWordsArray.length - 1) {
            replyItems = replyItems + keyWordsArray[i].replace(" ", "%20") + ')'
        } else {
            replyItems = replyItems + keyWordsArray[i].replace(" ", "%20") + '%20OR%20'
        }
    }
    const replySearchQuery = 'verified' + '%20' + place + '%20' + replyItems + '%20' + '-need' + '%20' + '-needed' + '%20' + '-required&f=live'
    const replyText = `@${u1} @${u2} Check out these tweets for leads:\nhttps://twitter.com/search?q=${replySearchQuery}\n\nFind more here: https://drive.google.com/drive/folders/1y8fjrbdGEGmcStkNE_Jf5sNRaDCY4zRA`
    return replyText
}

function tweeted(err, reply) {
    if (err) {
        console.log(err.message);
    } else {
        console.log('Tweeted: ' + reply.text);
    }
}

function streamConnect(retryAttempt) {

    const stream = needle.get(streamURL, {
        headers: {
            "User-Agent": "v2FilterStreamJS",
            "Authorization": `Bearer ${token}`
        },
        timeout: 20000
    });

    stream.on('data', async (data) => {
        try {
            const json = JSON.parse(data);
            console.log(json);
            const idToReply = json.data.id
            const getTweetURL = `https://api.twitter.com/2/tweets/${idToReply}?expansions=referenced_tweets.id,entities.mentions.username,author_id&tweet.fields=text`
            const response = await needle('get', getTweetURL, {
                headers: {
                    "authorization": `Bearer ${token}`
                }
            })
        
            if (response.statusCode !== 200) {
                console.log("Error:", response.statusMessage, response.statusCode)
                throw new Error(response.body);
            }
        
            try {
                const replyText = createReplyText(response.body.includes.tweets[0].text, response.body.includes.users[0].username, response.body.includes.users[1].username)
                T.post('statuses/update', { status: replyText, in_reply_to_status_id: idToReply }, tweeted)
            } catch (e) {
                console.log(e)
            }

            retryAttempt = 0;
        } catch (e) {
            if (data.detail === "This stream is currently at the maximum allowed connection limit.") {
                console.log(data.detail)
                process.exit(1)
            } else {
                // Keep alive signal received. Do nothing.
            }
        }
    }).on('err', error => {
        if (error.code !== 'ECONNRESET') {
            console.log(error.code);
            process.exit(1);
        } else {
            // This reconnection logic will attempt to reconnect when a disconnection is detected.
            // To avoid rate limits, this logic implements exponential backoff, so the wait time
            // will increase if the client cannot reconnect to the stream. 
            setTimeout(() => {
                console.warn("A connection error occurred. Reconnecting...")
                streamConnect(++retryAttempt);
            }, 2 ** retryAttempt)
        }
    });

    return stream;

}


(async () => {
    let currentRules;

    try {
        // Gets the complete list of rules currently applied to the stream
        currentRules = await getAllRules();

        // Delete all rules. Comment the line below if you want to keep your existing rules.
        await deleteAllRules(currentRules);

        // Add rules to the stream. Comment the line below if you don't want to add new rules.
        await setRules();

    } catch (e) {
        console.error(e);
        process.exit(1);
    }

    // Listen to the stream.
    streamConnect(0);
})();