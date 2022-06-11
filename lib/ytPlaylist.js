const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
let settings = { method: "Get" };
let YoutubeAPIKey = process.env.YoutubeAPIKey;

var express = require('express');
var app = module.exports = express();

app.get('/ytPlaylist', (req,res)=>{

    var PlaylistID = req.query.id;
    let url = `https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=49&playlistId=${PlaylistID}&key=${YoutubeAPIKey}`
    let list
    fetch(url, settings)
    .then(res => res.json())
    .then((json) => {
      //after getting the video results, we call fetch again to get their durations
        let url2 = `https://www.googleapis.com/youtube/v3/videos?id=`
      for(var i in json.items){
        url2 = url2 + json.items[i].snippet.resourceId.videoId+',';
      }

      url2 = url2 + `&part=contentDetails,statistics&key=${YoutubeAPIKey}`;
      fetch(url2, settings)
      .then(res => res.json())
      .then((json2) => {
        for(var i in json.items){
            try{
              json.items[i].snippet.length = json2.items[i].contentDetails.duration;
              json.items[i].snippet.views = json2.items[i].statistics.viewCount;
            }catch(err){
              json.items[i].snippet.length = '';
              json.items[i].snippet.views = '';
            }
        }
        list = json
      })
      .then(()=>{
        res.json(list);
      })
    });

})
