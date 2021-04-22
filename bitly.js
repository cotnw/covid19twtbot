const axios = require('axios');
const fetch = require('node-fetch');

const bitlyAccessToken = process.env.BITLY_ACCESS_TOKEN;

const bitlyConfig = {
    headers: {
        'Authorization': `Bearer ${bitlyAccessToken}`,
        'Content-Type': 'application/json'
    }
}

const generateBitlyUrl = async tweetUrl => {
    const bitlyResponse = await axios.post(
        "https://api-ssl.bitly.com/v4/shorten",
        JSON.stringify({ "domain": "bit.ly", "long_url": tweetUrl }),
        bitlyConfig
    );

    const bitlyUrl = bitlyResponse.data.link;
    return bitlyUrl;
}

module.exports = generateBitlyUrl;