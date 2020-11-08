const fetch = require('node-fetch');
const ffmpeg = require('ffmpeg');
let settings = { method: "Get" };
let YoutubeAPIKey = process.env.YoutubeAPIKey;

var express = require('express');
var app = module.exports = express();

app.get('/search', (req,res)=>{

    var Query = req.query.Query;
    let url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${Query}&maxResults=25&regionCode=US&key=${YoutubeAPIKey}`
    let list
    fetch(url, settings)
    .then(res => res.json())
    .then((json) => {
      //after getting the video results, we call fetch again to get their durations
        let url2 = `https://www.googleapis.com/youtube/v3/videos?id=`
      for(var i in json.items){
        url2 = url2 + json.items[i].id.videoId+',';
      }

      url2 = url2 + `&part=contentDetails&key=${YoutubeAPIKey}`;
      
      fetch(url2, settings)
      .then(res => res.json())
      .then((json2) => {
        for(var i in json.items){
          try{
            json.items[i].snippet.length = json2.items[i].contentDetails.duration;
          }catch(err){
            json.items[i].snippet.length = '';
          }
        }
        list = json
      })
      .then(()=>{
        res.json(list);
      })
    });

})
