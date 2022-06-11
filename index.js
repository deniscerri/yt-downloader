const express = require('express')
const cors = require('cors');

const app = express();
var root = __dirname

app.listen(process.env.PORT, () =>{
  console.log('Server is working');
});

app.use(cors());
app.use(express.static(root + "/public"));

const ytmp3 = require('./lib/ytAudio')
const ytmp4 = require('./lib/ytVideo')
const ytSearch = require('./lib/ytSearch')
const ytPlaylist = require('./lib/ytPlaylist')
const soundcloud = require('./lib/soundcloud')
const videoInfo = require('./lib/ytVideoInfo')

app.use(ytmp3)
app.use(ytmp4)
app.use(ytSearch)
app.use(ytPlaylist)
app.use(soundcloud)
app.use(videoInfo)