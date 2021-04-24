function createReplyText(text, u1, u2) {
    const tweetText = text.toLowerCase()
    const searchKeywords = ['bed', 'beds', 'oxygen', 'ventilator', 'fabiflu', 'remdesivir', 'favipiravar', 'tocilizumab', 'plasma', 'icu', 'icu beds', 'hospital beds', 'rt pcr', 'acterma', 'covid test', 'itolizumab', 'fapvir', 'faviblu', 'flugard', 'fevindo', 'araflu', 'avigan', 'favilow', 'favipill', 'cipvir']
    const cities = ["gurgaon", "noida", "dehradun", "delhi", "kanpur", "mumbai", "kolkata", "bangalore", "chennai", "hyderabad", "pune", "ahmedabad", "surat", "lucknow", "jaipur", "cawnpore", "mirzapur", "nagpur", "ghaziabad", "indore", "vadodara", "vishakhapatnam", "bhopal", "chinchvad", "patna", "ludhiana", "agra", "kalyan", "madurai", "jamshedpur", "nasik", "faridabad", "aurangabad", "rajkot", "meerut", "jabalpur", "thane", "dhanbad", "allahabad", "varanasi", "srinagar", "amritsar", "aligarh", "bhiwandi", "gwalior", "bhilai", "haora", "ranchi", "bezwada", "chandigarh", "mysore", "raipur", "kota", "bareilly", "jodhpur", "coimbatore", "dispur", "jhunjhunu", "guwahati", "solapur", "trichinopoly", "hubli", "jalandhar", "bhubaneshwar", "bhayandar", "moradabad", "kolhapur", "thiruvananthapuram", "saharanpur", "warangal", "salem", "malegaon", "kochi", "gorakhpur", "shimoga", "tiruppur", "guntur", "raurkela", "mangalore", "nanded", "cuttack", "chanda", "dehra dun", "durgapur", "asansol", "bhavnagar", "amravati", "nellore", "ajmer", "tinnevelly", "bikaner", "agartala", "ujjain", "jhansi", "ulhasnagar", "davangere", "jammu", "belgaum", "gulbarga", "jamnagar", "dhulia", "gaya", "jalgaon", "kurnool", "udaipur", "bellary", "sangli", "tuticorin", "calicut", "akola", "bhagalpur", "sikar", "tumkur", "quilon", "muzaffarnagar", "bhilwara", "nizamabad", "bhatpara", "kakinada", "parbhani", "panihati", "latur", "rohtak", "rajapalaiyam", "ahmadnagar", "cuddapah", "rajahmundry", "alwar", "muzaffarpur", "bilaspur", "mathura", "kamarhati", "patiala", "saugor", "bijapur", "brahmapur", "shahjanpur", "trichur", "barddhaman", "kulti", "sambalpur", "purnea", "hisar", "firozabad", "bidar", "rampur", "shiliguri", "bali", "panipat", "karimnagar", "bhuj", "ichalkaranji", "tirupati", "hospet", "aizawl", "sannai", "barasat", "ratlam", "handwara", "drug", "imphal", "anantapur", "etawah", "raichur", "ongole", "bharatpur", "begusarai", "sonipat", "ramgundam", "hapur", "uluberiya", "porbandar", "pali", "vizianagaram", "puducherry", "karnal", "nagercoil", "tanjore", "sambhal", "shimla", "ghandinagar", "shillong", "port blair", "gangtok", "kohima", "itanagar", "panaji", "daman", "kavaratti", "panchkula", "kagaznagar"]
    let moveAhead = false
    searchKeywords.forEach(keyword => {
        if(tweetText.includes(keyword)) {
            moveAhead = true
        } 
    })
    if(!moveAhead) { return "The bot can't find any keyword in the tweet" }
    const keyWordsArray = []
    searchKeywords.forEach(keyword => {
        if(tweetText.includes(keyword)) {
            keyWordsArray.push(keyword)
        }
    })
    if(keyWordsArray.length == 0) { return "The bot can't find any keyword in the tweet"}
    let place = 'none'
    cities.forEach(city => {
        if(tweetText.includes(city)) {
            place = city
        }
    })
    if(place == 'none') { return "The bot can't find the name of the place" }
    let replyItems = '('
    for (let i = 0; i < keyWordsArray.length; i++) {
        if (i == keyWordsArray.length - 1) {
            replyItems = replyItems + keyWordsArray[i].replace(" ", "%20") + ')'
        } else {
            replyItems = replyItems + keyWordsArray[i].replace(" ", "%20") + '%20OR%20'
        }
    }
    const replySearchQuery = 'verified' + '%20' + place + '%20' + replyItems + '%20' + '-need' + '%20' + '-needed' + '%20' + '-required&f=live'
    const replyText = `@${u1} @${u2}\nCheck out these tweets for leads:\nhttps://twitter.com/search?q=${replySearchQuery}\n\nFind more here: https://drive.google.com/drive/folders/1y8fjrbdGEGmcStkNE_Jf5sNRaDCY4zRA`
    return replyText
}

console.log(createReplyText(`Urgently need ventilator ICU bed for my grandmother in Ahmedabad. Please help. Oxygen level is drastically falling down. Contact 7383914255 (Vrutant Jagtap)`, "anshul", "laxya"))

            