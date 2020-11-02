const express = require('express')
const fs = require('fs')
const cors = require('cors');
const path = require('path');

const ytdl = require('ytdl-core')
const scdl = require('soundcloud-downloader');

const contentDisposition = require('content-disposition');

const spawn = require('child_process').spawn

const app = express();
var application_root = __dirname

app.listen(process.env.PORT, () =>{
  console.log('Server is working');
});


app.use(cors());

app.use(express.static(application_root + "/public"));




const fetch = require('node-fetch');
const { url } = require('inspector');
const { PRIORITY_HIGHEST } = require('constants');
const ffmpeg = require('ffmpeg');
let settings = { method: "Get" };
let YoutubeAPIKey = process.env.YoutubeAPIKey;

app.get('/search', (req,res)=>{

    var Query = req.query.Query;
    let url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${Query}&maxResults=25&regionCode=US&key=${YoutubeAPIKey}`
    let list
    fetch(url, settings)
    .then(res => res.json())
    .then((json) => {
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
            json.items[i].id.length = json2.items[i].contentDetails.duration;
          }catch(err){
            json.items[i].id.length = '';
          }
        }
        list = json
      })
      .then(()=>{
        res.json(list);
      })
    });

})


app.get('/download/yt', async (req, res) =>{
  var URL = req.query.URL;

//If something went wrong and files didnt get deleted, we clear them beforehand
fs.readdir(__dirname, (err, files) =>{
  if (err) throw err;
  for (const file of files) {
    if(file.endsWith('.mp3') || file.endsWith('.m4a')){
      fs.unlink(path.join(__dirname, file), err => {
        if (err) throw err;
      });
    }
  }
})
 
  try {
      URL = fixURL(URL);
      let info = await ytdl.getInfo(URL)
      console.log(info.videoDetails);
      var title = info.videoDetails.title;
      //remove escape characters that cause errors
      title = title.replace(/[\'\\\/\"]/g,'')
      let filename = `${title}.m4a`;
      res.setHeader('Content-Type', 'audio/mpeg')

      //if conversion goes wrong, we use ext variable to make header send m4a file instead
      let ext = 'mp3';

      // Get audio stream going
      const audio = ytdl(URL, { filter: 'audioonly', quality: 'highestaudio' })
      .once('end', () =>{
        console.log('Finished Downloading')
        var proc = spawn('ffmpeg', [`-i`,`${title}.m4a`,`${title}.mp3`])
        
          proc.stdout.on('data', function(data) {
              console.log(data);
          });
          
          proc.stderr.setEncoding("utf8")
          proc.stderr.on('data', function(data) {
              console.log(data);
              ext = 'm4a'
          });
          
          proc.on('close', function() {
            fs.unlinkSync(__dirname + `/${title}.m4a`)
  
            var file = fs.createReadStream(`${title}.mp3`);
            file.on('end', function(err) {
              fs.unlink(`${title}.mp3`, function() {
                // file deleted
              });
            });
            res.setHeader('Content-disposition', contentDisposition(`${title}.${ext}`));
            file.pipe(res);

          });

        });

      audio.pipe(fs.createWriteStream(__dirname + `/${title}.m4a`))
  
    } catch (err) {
        console.log(err);
    }


})

scID = process.env.scID;

app.get('/download/sc', async (req, res) =>{
  var URL = req.query.URL;

  try {

    let info = await scdl.getInfo(URL, scID);
    let filename = info.publisher_metadata.artist +" - "+ info.title+".mp3";

    res.writeHead(200, {
      'Content-Type': 'audio/mpeg',
      'Content-disposition': contentDisposition(filename)});


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


  //If something went wrong and files didnt get deleted, we clear them beforehand
fs.readdir(__dirname, (err, files) =>{
  if (err) throw err;
  for (const file of files) {
    if(file.endsWith('.mp4')){
      fs.unlink(path.join(__dirname, file), err => {
        if (err) throw err;
      });
    }
  }
})
  
  try {
      URL = fixURL(URL);
      let info = await ytdl.getInfo(URL)
      console.log(info.videoDetails.title);

      var title = info.videoDetails.title;
      //remove escape characters that cause errors
      title = title.replace(/[\'\\\/]/g,'')
      let filename = `${title}.mp4`;

      

      res.writeHead(200, {
        'Content-Type': 'video/mp4',
        'Content-disposition': contentDisposition(filename)});


           // Get audio and video stream going
      const audio = ytdl(URL, { filter: 'audioonly', quality: 'highestaudio' })
      const video = ytdl(URL, { filter: 'videoonly', quality: 'highestvideo' })
      .once('end', () =>{
        console.log('Finished Downloading')
        
        var proc = spawn('ffmpeg', [`-i`,`${title}1.mp4`,`-i`,`${title}.m4a`,`-c:v`,`copy`,`-c:a`,`copy`,`${title}.mp4`])
        
          proc.stdout.on('data', function(data) {
              console.log(data);
          });
          
          proc.stderr.setEncoding("utf8")
          proc.stderr.on('data', function(data) {
              console.log(data);
              console.log('Error on merging. Sending SD quality video')
              ytdl(URL, {
                quality: 'highest',
              }).pipe(res);
          });
          
          proc.on('close', function() {
            fs.unlinkSync(__dirname + `/${title}.m4a`)
            fs.unlinkSync(__dirname + `/${title}1.mp4`)
  
  
            var file = fs.createReadStream(filename);
            file.on('end', function(err) {
              fs.unlink(filename, function() {
                // file deleted
              });
            });
            
            file.pipe(res);
          });
        
      })

      
      audio.pipe(fs.createWriteStream(__dirname + `/${title}.m4a`))
      video.pipe(fs.createWriteStream(__dirname + `/${title}1.mp4`))
  
    } catch (err) {
        console.log(err);
    }


})


function fixURL(url){
  let fixed = 'https://youtube.com/watch?v=';
  if(url.startsWith('https://youtu.be/')){
    for(var i = 17;i<url.length;i++){
      if(url[i]=='?'){
        break;
      }
      fixed = fixed + url[i];
    }
  }else{
    fixed = url;
  }
  console.log(fixed);
  return fixed;
}
