const ytdl = require('ytdl-core')
const ffmpeg = require('ffmpeg-static')
const contentDisposition = require('content-disposition');
const spawn = require('child_process').spawn;

var express = require('express');
var app = module.exports = express();

app.get('/download/yt', async (req, res) =>{
    var URL = req.query.URL;
    URL = fixURL(URL);

    try {
         try{
            let info = await ytdl.getInfo(URL)
            var title = info.videoDetails.title;
            //remove characters that cause errors
            title = title.replace(/[\'\\\/\|\"]/g,'')

            var tags = {
              title: title,
              artist: info.videoDetails.ownerChannelName,
            }
        }catch(err){
            var title = 'file'
            var tags = {
              title: '',
              artist: '',
            }
        }
        const audio = ytdl(URL, { filter: 'audioonly', quality: 'highestaudio' })
       
        res.writeHead(200, {
          'Content-Type': 'audio/mpeg',
          'Content-disposition': contentDisposition(`${title}.mp3`)});
  
        // Start the ffmpeg child process
        const ffmpegProcess = spawn(ffmpeg, [
          // Remove ffmpeg's console spamming
          '-loglevel', '8', '-hide_banner',
          // Set inputs
          '-i', 'pipe:3',
          '-c:a','libmp3lame',
          '-b:a','128k',
          // add metadata
          '-metadata', `title="${tags.title}"`,'-metadata',`artist="${tags.artist}"`,
          // Define output file
          '-f','mp3','pipe:4',
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
        ffmpegProcess.stdio[4].pipe(res);
        
      }catch (err) {
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
    console.log('Downloading: '+fixed);
    return fixed;
  }

