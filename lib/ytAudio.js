const ytdl = require('ytdl-core')
const ffmpeg = require('ffmpeg')
const spawn = require('child_process').spawn
const fs = require('fs')
const contentDisposition = require('content-disposition');
const path = require('path');

var express = require('express');
var app = module.exports = express();

app.get('/download/yt', async (req, res) =>{
    var URL = req.query.URL;
  
  //If something went wrong and files didnt get deleted, we clear them beforehand
  deleteFiles('mp3') 
  deleteFiles('m4a')
  URL = fixURL(URL);

    try {
        try{
            let info = await ytdl.getInfo(URL)
            var title = info.videoDetails.title;
            //remove characters that cause errors
            title = title.replace(/[\'\\\/\|\"]/g,'')
        }catch(err){
            var title = 'file'
        }
      
        //if conversion goes wrong, we use ext variable to make header send m4a file instead
        let ext = 'mp3'
        // Get audio stream going
        const audio = ytdl(URL, { filter: 'audioonly', quality: 'highestaudio' })
        .once('end', () =>{
          //finished downloading
          console.log('Finished Downloading')
            var proc = spawn('ffmpeg', [`-i`,`${__dirname}/${title}.m4a`,`${__dirname}/${title}.mp3`])

              //If you catch error, then conversion fails so we send the m4a file
              proc.on('error',function(err){
                console.log('Error: '+ err);
                ext = 'm4a'
              })

              proc.on('close', function() {
                var file = fs.createReadStream(__dirname + `/${title}.mp3`);
                file.on('end', function(err) {
                  //if there are no errors, then delete the m4a file too
                  if(ext == 'mp3'){
                    fs.unlink(__dirname + `/${title}.m4a`, function() {
                      // file deleted
                    });
                  }
                  //delete mp3 file after sending to user
                  fs.unlink(__dirname + `/${title}.mp3`, function() {
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

