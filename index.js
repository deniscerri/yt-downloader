const express = require('express')
const fs = require('fs')
const cors = require('cors');

const ytdl = require('ytdl-core')
const scdl = require('soundcloud-downloader');

const contentDisposition = require('content-disposition');

const ffmpeg = require('fluent-ffmpeg');




const app = express();
var application_root = __dirname

app.listen(3000, () =>{
  console.log('Server is working at port: 3000');
});


app.use(cors());

app.use(express.static(application_root + "/public"));




const fetch = require('node-fetch');
let settings = { method: "Get" };
let YoutubeAPIKey = process.env.YoutubeAPIKey;

app.get('/search', (req,res)=>{

    var Query = req.query.Query;
    let url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${Query}&maxResults=25&key=${YoutubeAPIKey}`
  
    fetch(url, settings)
    .then(res => res.json())
    .then((json) => {
        res.json(json);
    });

})


app.get('/download/yt', async (req, res) =>{
  var URL = req.query.URL;
 
  try {
      console.log(URL);
      let info = await ytdl.getInfo(URL)

      let filename = info.videoDetails.title+".m4a";
      var title = info.videoDetails.title;

      res.writeHead(200, {
        'Content-Type': 'audio/mpeg',
        'Content-disposition':string.Format("attachment; filename={0}.m4a", filename)});

      // Get audio stream going
      const audio = ytdl(URL, { filter: 'audioonly', quality: 'highestaudio' })
      .pipe(res)
     
       
  
    } catch (err) {
        console.log(err);
    }


})

scID = process.env.SCID;

app.get('/download/sc', async (req, res) =>{
  var URL = req.query.URL;

  try {

    let info = await scdl.getInfo(URL, scID);
    let filename = info.publisher_metadata.artist +" - "+ info.title+".mp3";

    res.writeHead(200, {
      'Content-Type': 'audio/mpeg',
      'Content-disposition':string.Format("attachment; filename={0}.mp3", filename)});


         // Get audio and video stream going
    const audio = scdl.download(URL, scID).then(stream => stream.pipe(res));
     

  } catch (err) {
      console.log(err);
  }


})

app.get('/download/sp', async (req, res) =>{
  var URL = req.query.URL;
  
})

app.get('/download/MP4', async (req, res) =>{
  var URL = req.query.URL;
  
  try {

      let info = await ytdl.getInfo(URL)
      console.log(info.videoDetails.title);

      var title = info.videoDetails.title;
      //remove escape characters that cause errors
      title = title.replace(/[\'\\\/]/g,'')
      let filename = `${title}.mp4`;

      

      res.writeHead(200, {
        'Content-Type': 'video/mp4',
        'Content-disposition':string.Format("attachment; filename={0}.mp4", filename)});


           // Get audio and video stream going
      const audio = ytdl(URL, { filter: 'audioonly', quality: 'highestaudio' })
      const video = ytdl(URL, { filter: 'videoonly', quality: 'highestvideo' })
      .once('end', () =>{
        console.log('Finished Downloading')
        
        ffmpeg(`${title}1.mp4`)
        .addInput(`${title}.m4a`)
        .videoCodec('copy')
        .audioCodec('copy')
        .on("start", function(commandLine) {
            console.log("Spawned FFmpeg with command: " + commandLine);
        })
        .on('error', function(err, stdout, stderr) {
            console.log('Cannot process video: ' + err.message);
        })
        .on('end', function(stdout, stderr) {
            console.log('Merging succeeded !');
            fs.unlinkSync(__dirname + `/${title}.m4a`)
            fs.unlinkSync(__dirname + `/${title}1.mp4`)


            var file = fs.createReadStream(filename);
            file.on('end', function(err) {
              fs.unlink(filename, function() {
                // file deleted
              });
            });
            file.pipe(res);

        })
        .saveToFile(`${title}.mp4`)
      })

      
      audio.pipe(fs.createWriteStream(__dirname + `/${title}.m4a`))
      video.pipe(fs.createWriteStream(__dirname + `/${title}1.mp4`))
  
    } catch (err) {
        console.log(err);
    }


})
