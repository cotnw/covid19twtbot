const Twit = require('twit')
const config = require('./config');
const T = new Twit(config)

T.post('statuses/update', { status: 'hello world!' }, function(err, data, response) {
    console.log(data)
})

