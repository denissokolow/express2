const fs = require('fs');
const path = require('path');
const url = require('url');
const request = require('request');
const zlib = require('zlib');
const { Transform } = require('stream');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 4326;


app
  .get('/', (req, res) => {
    res
      .status(200)
      .set({
        'Content-Type': 'text/html; charset=utf-8'
      })
      .sendFile(__dirname + '/index.html')
  })
  .get('/pipe', r => request(url.format({ protocol: 'https', host: 'kodaktor.ru', pathname: '/g/forpipe' }))
    .pipe(r.res))

  .post('/zip', (req, res) => {
    res
      .status(200)
      .set({
        'Content-Type': 'application/octet-stream',
        'Content-Encoding': 'gip'
      })
    req
      .pipe(zlib.createGzip())
      .pipe(res);
  })
  .post('/trans', (req, res) => {
    const transformplus1 = function (c, enc, cb) {
      var plus = c.toString().split('').map(e => parseInt(e) + 1).join('');
      this.push(plus);
      cb();
    };
    const plus1 = new Transform({ transform: transformplus1 });
    req
      .pipe(plus1)
      .pipe(res);
  })
.listen(PORT);
