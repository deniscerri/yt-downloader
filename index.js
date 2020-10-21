const express = require('express')
const fs = require('fs')
const cors = require('cors');
const ytdl = require('ytdl-core')

const { promisify } = require('util')
const getInfoVideo =  promisify(ytdl.getInfo)


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

        const info = await getInfoVideo(URL.replace('https://www.youtube.com/watch?v=', ''))

        res.writeHead(200, {
        'Content-Type': 'application/force-download',
        'Content-disposition': `attachment; filename=${info.videoDetails.title}.${File}`
        });

        


        ytdl(URL,{
          quality: `${code}`
        }).pipe(res)

    } catch (err) {
        res.status(500).json(err)
    }
})
