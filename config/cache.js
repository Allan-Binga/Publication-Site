const NodeCache = require("node-cache")

//Cache Expires after 5 minutes
const cache = new NodeCache({
    stdTTL: 300,
    checkperiod: 60,
})

module.exports = cache;