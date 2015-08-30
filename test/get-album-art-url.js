var assert = require('assert')
var _ = require('lodash')
var utils = require('./utils')
var api = require('../')

module.exports = function getArchiveTests() {
  // assumes getArchive works
  api.getArchive(function (err, res) {
    var streaming = utils.getFirstStream(res)

    api.getAlbumArtUrl({ url: streaming.url, apiKey: utils.apiKey }, function (err, res) {
      assert.equal(true, _.startsWith(res, 'http'))
      assert.equal(true, _.endsWith(res, '.jpg'))

      console.log('getAlbumArtUrl returns an image url')
    })
  })
}
