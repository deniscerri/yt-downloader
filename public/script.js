var convertBtn = document.querySelector('.mp3-button');
var convertBtn2 = document.querySelector('.mp4-button');
var URLinput = document.querySelector('.URL-input');


convertBtn.addEventListener("click", function(){
  console.log(`URL:${URLinput.value}`);
  window.location.href = `http://localhost:3000/download/MP3/?URL=${URLinput.value}`
})


convertBtn2.addEventListener("click", function(){
  console.log(`URL:${URLinput.value}`);
  window.location.href = `http://localhost:3000/download/MP4?URL=${URLinput.value}`
})
