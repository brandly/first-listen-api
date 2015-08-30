var cheerio = require('cheerio')
var request = require('request')

module.exports = function getAlbumArtUrl(opts, callback) {
  opts || (opts = {})

  request(opts.url, function (err, res, body) {
    if (err) { return callback(err) }

    var $ = cheerio.load(body)
    var albumArtUrl = $('.playlistwrap img')[0].attribs.src

    callback(null, albumArtUrl)
  })
}
