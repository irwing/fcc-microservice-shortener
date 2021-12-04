require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

let uris = [];

app.use(cors());

// parse application/json
app.use(bodyParser.json())

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

const protocol = 'https';
const regexUri = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;

const  generateRandomString = (num = 6) => {
  const randomString = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, num);
  return randomString;
}

app.post('/api/shorturl', function(req, res){

  let url = req.body.url;

  if(!regexUri.test(url)) {
    res.json({ error: 'invalid url' });
  }

  let id = generateRandomString(6);
  let shortUrl = `${protocol}://${req.headers['host']}/${id}`;

  let uri = {
    id,
    original_url: url,
    short_url: shortUrl
  };

  uris.push(uri);
  res.json({
    original_url: url,
    short_url: shortUrl
  });
});

app.get('/:id', function(req, res){

  let id = req.params.id;
  console.log(1, id);

  let uri = uris.filter(uri => uri.id == id);
  uri = uri[0];

  if(!regexUri.test(uri.original_url)) {
    res.json({ error: 'invalid url' });
  }
  res.redirect(uri.original_url);
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
