const Twit = require('twit')
const config = require('./config');
const T = new Twit(config)

const searchKeywords= ['beds', 'oxygen', 'ventilator', 'fabiflu', 'remdesivir', 'favipiravar', 'tocilizumab', 'plasma'] 
const cities = ["delhi", "mumbai", "kolkata", "bangalore", "chennai", "hyderabad", "pune", "ahmadabad", "surat", "lucknow", "jaipur", "cawnpore", "mirzapur", "nagpur", "ghaziabad", "indore", "vadodara", "vishakhapatnam", "bhopal", "chinchvad", "patna", "ludhiana", "agra", "kalyan", "madurai", "jamshedpur", "nasik", "faridabad", "aurangabad", "rajkot", "meerut", "jabalpur", "thane", "dhanbad", "allahabad", "varanasi", "srinagar", "amritsar", "aligarh", "bhiwandi", "gwalior", "bhilai", "haora", "ranchi", "bezwada", "chandigarh", "mysore", "raipur", "kota", "bareilly", "jodhpur", "coimbatore", "dispur", "guwahati", "solapur", "trichinopoly", "hubli", "jalandhar", "bhubaneshwar", "bhayandar", "moradabad", "kolhapur", "thiruvananthapuram", "saharanpur", "warangal", "salem", "malegaon", "kochi", "gorakhpur", "shimoga", "tiruppur", "guntur", "raurkela", "mangalore", "nanded", "cuttack", "chanda", "dehra dun", "durgapur", "asansol", "bhavnagar", "amravati", "nellore", "ajmer", "tinnevelly", "bikaner", "agartala", "ujjain", "jhansi", "ulhasnagar", "davangere", "jammu", "belgaum", "gulbarga", "jamnagar", "dhulia", "gaya", "jalgaon", "kurnool", "udaipur", "bellary", "sangli", "tuticorin", "calicut", "akola", "bhagalpur", "sikar", "tumkur", "quilon", "muzaffarnagar", "bhilwara", "nizamabad", "bhatpara", "kakinada", "parbhani", "panihati", "latur", "rohtak", "rajapalaiyam", "ahmadnagar", "cuddapah", "rajahmundry", "alwar", "muzaffarpur", "bilaspur", "mathura", "kamarhati", "patiala", "saugor", "bijapur", "brahmapur", "shahjanpur", "trichur", "barddhaman", "kulti", "sambalpur", "purnea", "hisar", "firozabad", "bidar", "rampur", "shiliguri", "bali", "panipat", "karimnagar", "bhuj", "ichalkaranji", "tirupati", "hospet", "aizawl", "sannai", "barasat", "ratlam", "handwara", "drug", "imphal", "anantapur", "etawah", "raichur", "ongole", "bharatpur", "begusarai", "sonipat", "ramgundam", "hapur", "uluberiya", "porbandar", "pali", "vizianagaram", "puducherry", "karnal", "nagercoil", "tanjore", "sambhal", "shimla", "ghandinagar", "shillong", "new delhi", "port blair", "gangtok", "kohima", "itanagar", "panaji", "daman", "kavaratti", "panchkula", "kagaznagar"]


var stream = T.stream('statuses/filter', { track: searchKeywords })

// ideal reply = gurgaon (bed OR beds OR oxygen OR ventilator OR ventilators OR fabiflu)

stream.on('tweet', function (tweet) {
    const tweetText = tweet.text
    const name = tweet.user.screen_name
    const id = tweet.id_str
    if(tweetText.includes("need") || tweetText.includes("needed")) {
        let replyItems = "("
        let replyPlace = "place"
        const textSplitArray = tweetText.split(" ")
        const keyWordsInTweet = []
        for(let i=0;i<textSplitArray.length;i++) {
            if(searchKeywords.includes(textSplitArray[i].toLowerCase())) {
                keyWordsInTweet.push(textSplitArray[i].toLowerCase())
            }
        }
        if(keyWordsInTweet.length != 0) {
            for(let i=0;i<keyWordsInTweet.length;i++) {
                if(i == keyWordsInTweet.length-1) {
                    replyItems = replyItems + keyWordsInTweet[i] + ')'
                } else {
                    replyItems = replyItems + keyWordsInTweet[i] + ' OR '
                }
            }
        }
        for(let i=0;i<textSplitArray.length;i++) {
            if(cities.includes(textSplitArray[i].toLowerCase())) {
                replyPlace = textSplitArray[i].toLowerCase()
            }
        }
        if(keyWordsInTweet.length != 0) { 
            if(replyPlace != "place") {
                console.log({tweet: tweetText, reply: replyPlace + ' ' +replyItems})
                console.log()
            }
        }
    }
})

