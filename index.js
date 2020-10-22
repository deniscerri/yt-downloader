const express = require('express')
const fs = require('fs')
const cors = require('cors');
const ytdl = require('ytdl-core')
const contentDisposition = require('content-disposition');

const ffmpeg = require('fluent-ffmpeg');




const app = express();
var application_root = __dirname

var port = process.env.port || 8080

app.listen(port, () =>{
  console.log('Server is working');
});


app.use(cors());

app.use(express.static(application_root + "/public"));


app.get('/download/MP3', async (req, res) =>{
  var URL = req.query.URL;
 
  try {

      let info = await ytdl.getInfo(URL)

      let filename = info.videoDetails.title+".mp3";
      var title = info.videoDetails.title;

      

      res.writeHead(200, {
        'Content-Type': 'application/force-download',
        'Content-disposition':contentDisposition(filename)});


           // Get audio and video stream going
      const audio = ytdl(URL, { filter: 'audioonly', quality: 'highestaudio' })
      .pipe(res);
       
  
    } catch (err) {
        console.log(err);
    }


})

app.get('/download/MP4', async (req, res) =>{
  var URL = req.query.URL;
  
  try {

      let info = await ytdl.getInfo(URL)

      let filename = info.videoDetails.title+".mp4";
      var title = info.videoDetails.title;

      

      res.writeHead(200, {
        'Content-Type': 'application/force-download',
        'Content-disposition':contentDisposition(filename)});


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
            file.on('end', function() {
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
