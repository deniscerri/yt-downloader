const ytdl = require('ytdl-core')
const ffmpeg = require('ffmpeg')
const fs = require('fs')
const spawn = require('child_process').spawn
const contentDisposition = require('content-disposition');
const path = require('path');

var express = require('express');
var app = module.exports = express();

app.get('/download/MP4', async (req, res) =>{
    var URL = req.query.URL;
    //If something went wrong and files didnt get deleted, we clear them beforehand
    deleteFiles('mp4');
    URL = fixURL(URL);
  
    try {
        let info = await ytdl.getInfo(URL)
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
          //finished downloading
          var proc = spawn('ffmpeg', [`-i`,`${__dirname}/${title}1.mp4`,`-i`,`${__dirname}/${title}.m4a`,`-c:v`,`copy`,`-c:a`,`copy`,`${__dirname}/${title}.mp4`])

            proc.on('error',function(err){
              console.log('Error: '+ err);
              console.log('Error on merging. Sending SD quality video')
                ytdl(URL, {
                  quality: 'highest',
                }).pipe(res);
            })
            
            proc.on('close', function() {
              fs.unlinkSync(__dirname + `/${title}.m4a`)
              fs.unlinkSync(__dirname + `/${title}1.mp4`)
    
    
              var file = fs.createReadStream(__dirname+'/'+filename);
              file.on('end', function(err) {
                fs.unlink(__dirname+'/'+filename, function() {
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
  
  
  function deleteFiles(ext){
    fs.readdir(__dirname, (err, files) =>{
      if (err) throw err;
      for (const file of files) {
        if(file.endsWith(`.${ext}`)){
          fs.unlink(path.join(__dirname, file), err => {
            if (err) throw err;
          });
        }
      }
    })
  }