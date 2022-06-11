const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
let settings = { method: "Get" };
let YoutubeAPIKey = 'AIzaSyB41R-kjCc6AezNxEp-t9xYUP_-3RfN92E';

var express = require('express');
var app = module.exports = express();

app.get('/video', (req,res)=>{

    var VideoID = req.query.id;
    let url = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet&id=${VideoID}&key=${YoutubeAPIKey}`
    let list
    fetch(url, settings)
    .then(res => res.json())
    .then((json) => {
      list = json;
      res.json(list);
    });

})
