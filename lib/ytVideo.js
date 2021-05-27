const ytdl = require('ytdl-core')
const ffmpeg = require('ffmpeg-static')
const spawn = require('child_process').spawn
const contentDisposition = require('content-disposition');

var express = require('express');
var app = module.exports = express();

app.get('/download/MP4', async (req, res) =>{
     var URL = req.query.URL;
    // //If something went wrong and files didnt get deleted, we clear them beforehand
    URL = fixURL(URL);
  
    try {
        let info = await ytdl.getInfo(URL)
        var title = info.videoDetails.title;
        //remove escape characters that cause errors
        title = title.replace(/[\'\\\/]/g,'')
        let filename = `${title}.mkv`;
  
        res.writeHead(200, {
          'Content-Type': 'video/x-matroska',
          'Content-disposition': contentDisposition(filename)});
  
  
        // Get audio and video streams
        const audio = ytdl(URL, { quality: 'highestaudio' })
        const video = ytdl(URL, { quality: 'highestvideo' })
        
        // Start the ffmpeg child process
        const ffmpegProcess = spawn(ffmpeg, [
          // Remove ffmpeg's console spamming
          '-loglevel', '8', '-hide_banner',
          // Set inputs
          '-i', 'pipe:3',
          '-i', 'pipe:4',
          // Map audio & video from streams
          '-map', '0:a',
          '-map', '1:v',
          // Keep encoding
          '-c:v', 'copy',
          // Define output file
          '-f','matroska','pipe:5',
        ], {
          windowsHide: true,
          stdio: [
            /* Standard: stdin, stdout, stderr */
            'inherit', 'inherit', 'inherit',
            /* Custom: pipe:3, pipe:4, pipe:5 */
            'pipe', 'pipe', 'pipe',
          ],
        });
       
        audio.pipe(ffmpegProcess.stdio[3]);
        video.pipe(ffmpegProcess.stdio[4]);
        ffmpegProcess.stdio[5].pipe(res);
    
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
