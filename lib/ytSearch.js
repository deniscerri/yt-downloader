const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
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
      //after getting the video results, we call fetch again to more info on videos like durations
        let url2 = `https://www.googleapis.com/youtube/v3/videos?id=`
      for(var i in json.items){
        url2 = url2 + json.items[i].id.videoId+',';
      }

      url2 = url2 + `&part=contentDetails,statistics&key=${YoutubeAPIKey}`;
      

      let j = 0;
      fetch(url2, settings)
      .then(res => res.json())
      .then((json2) => {
        for(var i in json.items){
          if(json.items[i].id.kind == 'youtube#video' || json.items[i].kind == 'youtube#playlistItem'){
            try{
              json.items[i].snippet.length = json2.items[j].contentDetails.duration;
              json.items[i].snippet.views = json2.items[j].statistics.viewCount;
            }catch(err){
              json.items[i].snippet.length = '';
            }
            j++;
          }
        }
        list = json
      })
      .then(()=>{
        res.json(list);
      })
    });

})
