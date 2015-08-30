var assert = require('assert')
var api = require('../')

var DEFAULT_RESULTS_LENGTH = 15

module.exports = function getArchiveTests() {
  api.getArchive(function (err, res) {
    assert.equal(null, err)
    assert.equal(DEFAULT_RESULTS_LENGTH, res.length)
    assertArchiveList(res)

    console.log('getArchive handles basic case')
  })

  api.getArchive({ start: 20 }, function (err, res) {
    assert.equal(null, err)
    assert.equal(DEFAULT_RESULTS_LENGTH, res.length)
    assertArchiveList(res)

    console.log('getArchive accepts a `start` value')
  })
}

function assertFirstListen(firstListen) {
  assert.equal(true, firstListen.hasOwnProperty('artist'))
  assert.equal(true, firstListen.hasOwnProperty('album'))
  assert.equal(true, firstListen.hasOwnProperty('streaming'))
  assert.equal(true, firstListen.hasOwnProperty('url'))
}

function assertReview(review) {
  assert.equal(true, review.hasOwnProperty('artist'))
  assert.equal(true, review.hasOwnProperty('album'))
  assert.equal(true, review.hasOwnProperty('url'))
}

function assertArchiveList(list) {
  list.forEach(function (item) {
    switch (item.type) {
      case 'first-listen':
        assertFirstListen(item)
        break

      case 'review':
        assertReview(item)
        break

      default:
        throw 'Unexpected type in archive list'
        break
    }
  })
}
