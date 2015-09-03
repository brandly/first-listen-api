var cheerio = require('cheerio')
var request = require('superagent')

module.exports = function getAlbumArtUrl (opts, callback) {
  opts || (opts = {})

  request(opts.url, function (err, res) {
    if (err) { return callback(err) }

    var $ = cheerio.load(res.text)
    var albumArtUrl = $('.playlistwrap img')[0].attribs.src

    callback(null, albumArtUrl)
  })
}
