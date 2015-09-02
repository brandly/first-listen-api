var assert = require('assert')
var utils = require('./utils')
var api = require('../')

module.exports = function getArchiveTests() {
  // assumes getArchive works
  api.getArchive(function (err, archive) {
    var streaming = utils.getFirstStream(archive)

    api.getFirstListen({ url: streaming.url, apiKey: utils.apiKey }, function (err, res) {
      assert.equal(true, res.length > 0)
      res.forEach(assertSong)

      console.log('getFirstListen returns some songs')
    })
  })
}

function assertSong(song) {
  assert.equal(true, song.hasOwnProperty('track'))
  assert.equal(true, song.hasOwnProperty('title'))
  assert.equal(true, song.hasOwnProperty('artist'))
  assert.equal(true, song.hasOwnProperty('album'))
  assert.equal(true, song.hasOwnProperty('url'))
}
