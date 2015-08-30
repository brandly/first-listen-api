var cheerio = require('cheerio')
var request = require('request')
var _ = require('lodash')

module.exports = function (opts, callback) {
  if (typeof opts === 'function') {
    callback = opts
    opts = {}
  }

  opts || (opts = {})
  var start = opts.start || 0

  request({
    url: 'http://www.npr.org/series/98679384/first-listen/archive',
    qs: {
      start: start
    }
  }, function (err, res, body) {
    if (err) { return callback(err) }

    callback(null, parseArchive(body))
  })
}

function parseArchive(archive) {
  var $ = cheerio.load(archive)
  var itemInfoTags = _.toArray($('.item-info'))

  var songs = itemInfoTags.map(function (item) {
    var $item = $(item)
    var titleAnchor = $item.find('.title a')[0]
    var title = titleAnchor.children[0].data

    var isFirstListen = _.startsWith(title, 'First Listen: ')
    var parsedTitle = isFirstListen ? parseFirstListenTitle(title) : parseReviewTitle(title)

    var audioAvailability = isFirstListen ? getAudioAvailability($item) : null

    return _.extend(parsedTitle, audioAvailability, {
      url: titleAnchor.attribs.href
    })
  })

  return songs
}

function parseFirstListenTitle(title) {
  var artistAlbum = splitArtistAlbum(title.split('First Listen: ')[1])

  return {
    type: 'first-listen',
    artist: artistAlbum[0],
    album: artistAlbum[1]
  }
}

function parseReviewTitle(title) {
  var artistAlbum = splitArtistAlbum(title.split('Review: ')[1])

  return {
    type: 'review',
    artist: artistAlbum[0],
    album: artistAlbum[1]
  }
}

function splitArtistAlbum(str) {
  var splits = str.split(', \'')
  return [splits[0], splits[1].slice(0, -1)]
}

function getAudioAvailability($item) {
  var audioPlayer = $item.find('.audio-player')
  var unavailable = audioPlayer.hasClass('unavailable')
  return {
    streaming: !unavailable
  }
}
