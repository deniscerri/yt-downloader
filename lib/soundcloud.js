const scdl = require('soundcloud-downloader');
const contentDisposition = require('content-disposition');

var express = require('express');
var app = module.exports = express();

scID = process.env.scID;

app.get('/download/sc', async (req, res) =>{
    var URL = req.query.URL;
  
    try {
  
      let info = await scdl.getInfo(URL, scID);
      let filename = info.publisher_metadata.artist +" - "+ info.title+".mp3";
  
      res.writeHead(200, {
        'Content-Type': 'audio/mpeg',
        'Content-disposition': contentDisposition(filename)});
  
      // Get audio stream going
      const audio = scdl.download(URL, scID).then(stream => stream.pipe(res));
       
  
    } catch (err) {
        console.log(err);
    }
  
  
  })
  
  
