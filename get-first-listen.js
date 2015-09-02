var cheerio = require('cheerio')
var request = require('superagent')
var _ = require('lodash')

module.exports = function getFirstListen(opts, callback) {
  opts || (opts = {})

  nprApiRequest({
    id: opts.id || getIdFromUrl(opts.url),
    fields: 'titles,audio,show',
    sort: 'assigned',
    apiKey: opts.apiKey
  }, function (err, res) {
    if (err) { return callback(err) }

    var $ = cheerio.load(res.text)
    var audioTags = _.toArray($('audio'))

    var albumTitle = $('audio[type="primary"] title')[0].children[0].data
    var artistName = getArtistFromCDATA($('story title')[0].children[0].data)

    function getSongFromTag(tag, i) {
      $tag = $(tag)
      return {
        track: i + 1,
        title: $tag.find('title')[0].children[0].data,
        artist: artistName,
        album: albumTitle,
        url: $tag.find('mp3[type="mp3"]')[0].children[0].data
      }
    }

    // Last tag is the entire album as a single .mp3 and I don't want it
    var songs = audioTags.map(getSongFromTag).slice(0, -1)

    callback(null, songs)
  });
};

function nprApiRequest(qs, callback) {
  request
    .get('http://api.npr.org/query')
    .query(qs)
    .end(callback)
}

function getIdFromUrl(url) {
  var withoutQueryString = url.split('?')[0]
  // http://www.npr.org/2015/07/08/420581193/first-listen-ratatat-magnifique
  var splits = withoutQueryString.split('/')
  return splits[splits.length - 2]
}

function getArtistFromCDATA(data) {
  // e.g. <![CDATA[ First Listen: Ratatat, 'Magnifique' ]]>
  var withoutLeadingChars = data.split('First Listen: ')[1]
  return withoutLeadingChars.split(", '")[0]
}
