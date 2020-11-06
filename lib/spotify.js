const fetch = require('node-fetch');

var express = require('express');
var app = module.exports = express();

let spdlTOKEN = ''
let spClient = '713dc19bfc5c46ffb34c136432199ebd'
let spSecret = 'da6977a2c2d749b391a4ffaac719ea1f'

app.get('/download/sp', async (req, res) =>{
  var URL = req.query.URL;
  URL = URL.substring(31)
  let songName = ''

  //GETTING TOKEN
  //turning credentials to a base64 string for the post request
  let credentials = Buffer.from(`${spClient}:${spSecret}`).toString('base64')
  fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic '+ credentials
    },
    body: 'grant_type=client_credentials'
  })
  .then(res => res.json())
  .then((json) => {
    //after getting the token we call a request to get song metadata about the song id we got from the URL
    spdlTOKEN = json.access_token;
      fetch(`https://api.spotify.com/v1/tracks/${URL}`,{
          method: "GET" ,
          headers: {'Authorization' : 'Bearer '+spdlTOKEN}
      })
      .then(res => res.json())
      .then((json) => {
        songName = json.artists[0].name + ' - ' +json.name;

        //SEARCH ON YOUTUBE THEN DOWNLOAD FIRST OPTIONS
      })
  })

})

