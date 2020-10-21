var convertBtn = document.querySelector('.mp3-button');
var convertBtn2 = document.querySelector('.mp4-button');
var URLinput = document.querySelector('.URL-input');


convertBtn.addEventListener("click", function(){
  console.log(`URL:${URLinput.value}`);
  sendURL(URLinput.value, 'mp3');
})


convertBtn2.addEventListener("click", function(){
  console.log(`URL:${URLinput.value}`);
  sendURL(URLinput.value, 'mp4');
})

function sendURL(URL,FILE){
  window.location.href = `http://ytdl.deniscerri.repl.co//download?URL=${URL}&File=${FILE}`
}
