var cheerio = require('cheerio')
var request = require('superagent')
var _ = require('lodash')

module.exports = function (opts, callback) {
  if (typeof opts === 'function') {
    callback = opts
    opts = {}
  }

  opts || (opts = {})
  var start = opts.start || 0

  request
    .get('http://www.npr.org/series/98679384/first-listen/archive')
    .query({ start: start })
    .end(function (err, res) {
      if (err) { return callback(err) }

      callback(null, parseArchive(res.text))
    })
}

function parseArchive (archive) {
  var $ = cheerio.load(archive)
  var itemInfoTags = _.toArray($('.item-info'))

  var songs = itemInfoTags.map(function (item) {
    var $item = $(item)
    var titleAnchor = $item.find('.title a')[0]
    var title = titleAnchor.children[0].data

    var isFirstListen = _.startsWith(title, 'First Listen: ')
    var isReview = _.startsWith(title, 'Review: ')

    var parsedTitle
    if (isFirstListen) {
      parsedTitle = parseFirstListenTitle(title)
    } else if (isReview) {
      parsedTitle = parseReviewTitle(title)
    } else {
      parsedTitle = parseOtherTitle(title)
    }

    var audioAvailability = isFirstListen ? getAudioAvailability($item) : null

    return _.extend(parsedTitle, audioAvailability, {
      url: titleAnchor.attribs.href
    })
  })

  return songs
}

function parseFirstListenTitle (title) {
  var artistAlbum = splitArtistAlbum(title.split('First Listen: ')[1])

  return {
    type: 'first-listen',
    artist: artistAlbum[0],
    album: artistAlbum[1]
  }
}

function parseReviewTitle (title) {
  var artistAlbum = splitArtistAlbum(title.split('Review: ')[1])

  return {
    type: 'review',
    artist: artistAlbum[0],
    album: artistAlbum[1]
  }
}

function parseOtherTitle (title) {
  var artistAlbum = splitArtistAlbum(title)

  return {
    type: 'other',
    artist: artistAlbum[0],
    album: artistAlbum[1]
  }
}

function splitArtistAlbum (str) {
  var splits = str.split(', \'')
  if (splits.length === 2) {
    return [splits[0], splits[1].slice(0, -1)]
  } else {
    // Only time I've seen this, it was an album title wrapped in quotes.
    // slice gets rid of the quotes.
    return ['Various Artists', str.slice(1, -1)]
  }
}

function getAudioAvailability ($item) {
  var audioPlayer = $item.find('.audio-player')
  var unavailable = audioPlayer.hasClass('unavailable')
  return {
    streaming: !unavailable
  }
}
