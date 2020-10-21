const express = require('express')
const fs = require('fs')
const cors = require('cors');
const ytdl = require('ytdl-core')

const app = express();
var application_root = __dirname

app.listen(3000, () =>{
  console.log('Server is working at port: 3000');
});


app.use(cors());

app.use(express.static(application_root + "/public"));

app.get('/download', async (req, res) =>{
  var URL = req.query.URL;
  var File = req.query.File;

  var code;
  if(File === 'mp3'){
    code = 'highestaudio';
  }else{
    code = 'highest';
  }

  try {
      //get information about the youtube video
      let info = await ytdl.getInfo(URL)

      try{
        //name the file as the Youtube title & attaching the format
        res.header('Content-Disposition', `attachment; filename=${info.videoDetails.title}.${File}`);
      }catch(err){
        //If the title has characters that are not allowed, use the Youtube url as title instead
        res.header('Content-Disposition', `attachment; filename=${URL}.${File}`);
      }
      

      ytdl(URL,{
        quality: `${code}`
      }).pipe(res)
      
  
    } catch (err) {
        console.log(err);
    }


})
