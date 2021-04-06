<p align="middle">
  <img src="https://cdn.mos.cms.futurecdn.net/SytNGv3ZxAVCkvcspmbbvh.jpg" width="100"/>
  <img src="./public/logos/sc.png" width="100" /> 
</p>

# Purpose

**Convert any video, playlist on youtube to audio or video format in their highest quality possible. Also Download SoundCloud songs too :)**

## Usage:
- Youtube link
    - If you have normal video link, paste it and press mp3 or mp4. If you want to download playlist videos make sure its a costum playlist and not a YouTube Mix one. Those playlists are costumised for your account and they will show random results in the page. 
    If you want to download the first song from that playlist, remove the playlist portion:
    
    Ex:      'https://www.youtube.com/watch?v=ois7lx1gsXw?list=PLKudU8kzJg7JIFglSp8T90Wv9Amf4MGuN'
    
    Turn it to: https://www.youtube.com/watch?v=ois7lx1gsXw ~~?list=PLKudU8kzJg7JIFglSp8T90Wv9Amf4MGuN~~
- SoundCloud link
    - Put the soundcloud song link and press mp3.
- Youtube Search and Youtube Playlists
    - If you search for certain videos or put a supported playlist link, video results will be listed for you to download

## How does it work:
- Youtube
    -For listing search results and playlist videos we call the youtube api two times. 1 time to get the results and the 2nd to get more details for each video. The 2nd call is made so we can show view count, release date and video length, making it easier to differentiate which video we want to download.
  
    - Downloading
        - Audio: They get downloaded as m4a, which is a better audio format than mp3 but most people dont really recognise that format and sometimes think of it as an mp4 file. We use ffmpeg to convert it and pipe it immediately through a download stream.
        - Video: There are two ways to download video. First one is to download a stream which has both audio and video together, but this method doesnt download the best quality. Youtube splits audio and video streams for higher quality videos. To get the best out of it, we download audio and video separately and use ffmpeg to mux them together and send them for download like we did with the audio.
  
- SoundCloud
  It doesn't need any extra tool since the file downloads as mp3 out of the box.

## Link:
[Click Here!](http://denisytdl.herokuapp.com/) [Or Here](http://ytdl.deniscerri.repl.co/)

---
### ToDo:
- [x] soundloud support
- [x] search function
- [x] playlist support
- [x] add extra details
- [ ] select quality



---
## Changelog:
- v1.0 - Create project. Basic audio/video download functionality
- v1.1 - SoundCloud Download Functionality
- v1.2 - Design Change. Youtube Search Functionality 
- v1.3 - Playlist support by listing all its videos
- v1.4 - Making downloads start immediately regardless of video length or size. In this case, download speeds suffer because of the file getting encoded while you are doing it. If you host it on a high performing server, you will get better results.
---

