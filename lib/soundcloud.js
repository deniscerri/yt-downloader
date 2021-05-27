const scdl = require('soundcloud-downloader').default;
const contentDisposition = require('content-disposition');

var express = require('express');
var app = module.exports = express();

scID = process.env.soundcloudID;

app.get('/download/sc', async (req, res) =>{
    var URL = req.query.URL;
  
    try {
      
      let info = await scdl.getInfo(URL, scID);
      let artist = '';
      try{
        artist = info.publiser_metadata.artist;
      }catch(err){
        artist = '';
      }

      let filename = '';
      if(artist != null){
        filename = info.title+".mp3";
      }else{
        filename = artist + ' - '+ info.title+".mp3";
      }
      
  
      res.writeHead(200, {
        'Content-Type': 'audio/mpeg',
        'Content-disposition': contentDisposition(filename)});
  
      // Get audio stream going
      const audio = scdl.download(URL, scID).then(stream => stream.pipe(res));
       
  
    } catch (err) {
        console.log(err);
    }
  
  
  })
  
  
