var _ = require('lodash')
var apiKey = 'MDAzMzQ2MjAyMDEyMzk4MTU1MDg3ZmM3MQ010'

module.exports = {
  getFirstStream: getFirstStream,
  apiKey: apiKey
}

function getFirstStream (list) {
  return _.first(list.filter(isStreaming))
}

function isStreaming (item) {
  return item.streaming
}
