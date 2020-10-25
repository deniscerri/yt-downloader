var mp3Btn = document.querySelector('.mp3-button');
var mp4Btn = document.querySelector('.mp4-button');
var URLinput = document.querySelector('.URL-input');


window.addEventListener("pageshow", () => {
  URLinput.value = "";
});

var source = 'yt'

URLinput.addEventListener('input', inputQuery)


function inputQuery(e){
  URLinput.style.border = "1px solid #0485ff";
  mp3Btn.style.background = "#0485ff";
  mp3Btn.style.border = "2px solid #0485ff";
  mp4Btn.style.display = "inline-block";

  source = 'yt';

  if (e.target.value == '') {
    URLinput.style.border = "1px solid #FF0000";
  }
  if((URLinput.value).startsWith('https://soundcloud.com/')){
      URLinput.style.border = "1px solid #FF8C00";
      mp3Btn.style.background = '#FF8C00';
      mp3Btn.style.border = "2px solid #FF8C00";
      mp4Btn.style.display = "none";

      source = 'sc';
  }

  if((URLinput.value).startsWith('https://open.spotify.com/')){
    URLinput.style.border = "1px solid #1DB954";
    mp3Btn.style.background = '#1DB954';
    mp3Btn.style.border = "2px solid #1DB954";
    mp4Btn.style.display = "none";

    source = 'sp'
  }
  
}

mp3Btn.addEventListener("click", function(){
  console.log(`URL:${URLinput.value}`);
  window.location.href = `http://localhost:3000/download/${source}/?URL=${URLinput.value}`
})


mp4Btn.addEventListener("click", function(){
  inputQuery(URLinput.value);
  
  console.log(`URL:${URLinput.value}`);
  window.location.href = `http://localhost:3000/download/MP4?URL=${URLinput.value}`
})
