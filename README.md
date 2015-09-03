# First Listen API [![Build Status](https://travis-ci.org/brandly/first-listen-api.svg?branch=master)](https://travis-ci.org/brandly/first-listen-api)

> Query data from NPR First Listen

```shell
$ npm install --save first-listen-api
```

## usage

With CommonJS

```js
var firstListenApi = require('first-listen-api')
```

You can access the full NPR First Listen archive, much like viewing http://www.npr.org/series/98679384/first-listen
```js
firstListenApi.getArchive(function (err, archive) { })
```

`archive` will be an array of objects. Some represent a "review" and others represent a "first-listen" album. Here are some examples:
```js
{
  type: 'first-listen',
  artist: '',
  album: '',
  streaming: true, // if the album is _currently_ available for streaming
  url: 'http...'
}
{
  type: 'review',
  artist: '',
  album: '',
  url: 'http...'
}
```

If you'd like to see past the first page of results, you can specify a `start`. It defaults to `0`
```js
firstListenApi.getArchive({ start: 15 }, function (err, res) { })
```

To get further than this, you'll need [an API key](http://www.npr.org/api/index). We'll assume you have one and call it `apiKey`.

If you have an NPR First Listen URL and you want the album artwork, I've got just what you're looking for.

```js
firstListenApi.getAlbumArtUrl({
  url: firstListenUrl,
  apiKey: apiKey
}, function (err, albumArtUrl) { })
```

If you have an NPR First Listen URL that is currently `streaming` and you want the individual songs in that album, you can find them here:

```js
firstListenApi.getFirstListen({
  url: firstListenUrl,
  apiKey: apiKey
}, function (err, songs) { })
```

`songs` will be an array of objects. Those objects will look something like this:

```js
{
  track: 1,
  title: '',
  artist: '',
  album: '',
  url: 'http...'
}
```

That's all for now.
