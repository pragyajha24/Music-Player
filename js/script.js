const wrapper = document.querySelector(".wrapper"),
  musicImg = wrapper.querySelector(".img-area img"),
  musicName = wrapper.querySelector(".song-details .name"),
  musicArtist = wrapper.querySelector(".song-details .artist"),
  mainAudio = wrapper.querySelector("#main-audio"),
  playPauseBtn = wrapper.querySelector(".play-pause"),
  prevBtn = wrapper.querySelector("#prev"),
  nextBtn = wrapper.querySelector("#next"),
  progressArea = wrapper.querySelector(".progress-area"),
  progressBar = wrapper.querySelector(".progress-bar"),
  musicList = wrapper.querySelector(".music-list"),
  showMoreBtn = wrapper.querySelector("#more-music"),
  hideMusicBtn = musicList.querySelector("#close");

//load random music on page refresh
let musicIndex = Math.floor(Math.random() * allMusic.length + 1);

window.addEventListener("load", () => {
  loadMusic(musicIndex); //calling load music function once window loads
  playingNow();
});

//load music function
function loadMusic(indexNumb) {
  musicName.innerText = allMusic[indexNumb - 1].name;
  musicArtist.innerText = allMusic[indexNumb - 1].artist;
  musicImg.src = `images/${allMusic[indexNumb - 1].img}.jpg`;
  mainAudio.src = `songs/${allMusic[indexNumb - 1].src}.mp3`;
}

//play music function
function playMusic() {
  wrapper.classList.add("paused");
  playPauseBtn.querySelector("i").innerText = "pause";
  mainAudio.play();
}

//pause music function
function pauseMusic() {
  wrapper.classList.remove("paused");
  playPauseBtn.querySelector("i").innerText = "play_arrow";
  mainAudio.pause();
}

//next music function
function nextMusic() {
  musicIndex++;
  //if musicIndex is greater than array length then musicIndex will be 1 so the first song will play
  musicIndex > allMusic.length ? (musicIndex = 1) : (musicIndex = musicIndex);
  loadMusic(musicIndex);
  playMusic();
  playingNow();
}

//prev music function
function prevMusic() {
  musicIndex--;
  //if musicIndex is less than 1 then musicIndex will be array length so the last song will play
  musicIndex < 1 ? (musicIndex = allMusic.length) : (musicIndex = musicIndex);
  loadMusic(musicIndex);
  playMusic();
  playingNow();
}

//play or pause music button event
playPauseBtn.addEventListener("click", () => {
  const isMusicPaused = wrapper.classList.contains("paused");
  //ifMusicPaused is true then call pauseMusic else call playMusic - on first click
  //  it will  return false because there is no paused class in wrapper
  //   so play music function  will call and we will add pause class
  //   inside playMusic function
  isMusicPaused ? pauseMusic() : playMusic();
  playingNow();
});

//next music btn event
nextBtn.addEventListener("click", () => {
  nextMusic(); //calling next music function
});

//prev music btn event
prevBtn.addEventListener("click", () => {
  prevMusic();
});

//update progress bar width according to music current time
mainAudio.addEventListener("timeupdate", (e) => {
  const currentTime = e.target.currentTime; //getting current time of song
  const duration = e.target.duration; //getting total duration of the  song
  let progressWidth = (currentTime / duration) * 100;
  progressBar.style.width = `${progressWidth}%`;

  let musicCurrentTime = wrapper.querySelector(".current"),
    musicDuration = wrapper.querySelector(".duration");

  mainAudio.addEventListener("loadeddata", () => {
    //update song total duration
    let audioDuration = mainAudio.duration;
    let totalMin = Math.floor(audioDuration / 60);
    let totalSec = Math.floor(audioDuration % 60);

    if (totalSec < 10) {
      //adding 0 if sec is less than 10
      totalSec = `0${totalSec}`;
    }

    musicDuration.innerText = `${totalMin} : ${totalSec}`;
  });

  //update playing song current time
  let currentMin = Math.floor(currentTime / 60);
  let currentSec = Math.floor(currentTime % 60);

  if (currentSec < 10) {
    //adding 0 if sec is less than 10
    currentSec = `0${currentSec}`;
  }

  musicCurrentTime.innerText = `${currentMin} : ${currentSec}`;
});

//updating playing song current time according to the progress bar width
progressArea.addEventListener("click", (e) => {
  let progressWidthval = progressArea.clientWidth; //getting width of a progress bar
  let clickedOffSetX = e.offsetX; //getting offset x value
  let songDuration = mainAudio.duration; //getting song total duration

  mainAudio.currentTime = (clickedOffSetX / progressWidthval) * songDuration;
  playMusic();
});

//repeat,shuffle song according to the icon
const repeatBtn = wrapper.querySelector("#repeat-plist");
repeatBtn.addEventListener("click", () => {
  //first we get the innerText of  the icon then we'll change accordingly
  let getText = repeatBtn.innerText; //getting innerText of icon
  //doing different changes on different icon click using switch
  switch (getText) {
    case "repeat": //if this icon is repeat then change it to repeat_one
      repeatBtn.innerText = "repeat_one";
      repeatBtn.setAttribute("title", "Song looped");
      break;
    case "repeat_one": //if icon is repeat_one then chnage it to shuffle
      repeatBtn.innerText = "shuffle";
      repeatBtn.setAttribute("title", "Playback shuffle");
      break;
    case "shuffle": //if icon is shuffle then change it to repeat
      repeatBtn.innerText = "repeat";
      repeatBtn.setAttribute("title", "Playlist looped");

      break;
  }
});

mainAudio.addEventListener("ended", () => {
  let getText = repeatBtn.innerText;

  //doing different changes on different icon click using switch
  switch (getText) {
    case "repeat": //if this icon is repeat then simply we call the nextmusic function so the next song will play
      nextMusic();
      break;
    case "repeat_one": //if icon is repeat_one then change the current playing song current time to  0 song will play
      mainAudio.currentTime = 0;
      loadMusic(musicIndex);
      playMusic();
      break;
    case "shuffle": //if icon is shuffle then change it to repeat
      let randIndex = Math.floor(Math.random() * allMusic.length + 1);
      do {
        randIndex = Math.floor(Math.random() * allMusic.length + 1);
      } while (musicIndex == randIndex);
      //this loop run until the next random number won't be  the same of current music index
      musicIndex = randIndex; //passing randomIndex to musicIndex so the random song will play
      loadMusic(musicIndex); //calling loadmusic function
      playMusic(); //calling playmusic function
      playingNow();
      break;
  }
});

showMoreBtn.addEventListener("click", () => {
  musicList.classList.toggle("show");
});

hideMusicBtn.addEventListener("click", () => {
  showMoreBtn.click();
});

const ulTag = wrapper.querySelector("ul");

for (let i = 0; i < allMusic.length; i++) {
  let liTag = `<li li-index="${i + 1}">
            <div class="row">
              <span>${allMusic[i].name}</span>
              <p>${allMusic[i].artist}</p>
            </div>
            <audio class="${allMusic[i].src}" src="songs/${
    allMusic[i].src
  }.mp3"></audio>
            <span id="${allMusic[i].src}" class="audio-duration">3:40</span>
          </li>`;

  ulTag.insertAdjacentHTML("beforeend", liTag);

  let liAudioDuration = ulTag.querySelector(`#${allMusic[i].src}`);
  let liAudioTag = ulTag.querySelector(`.${allMusic[i].src}`);

  liAudioTag.addEventListener("loadeddata", () => {
    let audioDuration = liAudioTag.duration;
    let totalMin = Math.floor(audioDuration / 60);
    let totalSec = Math.floor(audioDuration % 60);

    if (totalSec < 10) {
      //adding 0 if sec is less than 10
      totalSec = `0${totalSec}`;
    }

    liAudioDuration.innerText = `${totalMin} : ${totalSec}`;
    //adding t duration attribute which will use below
    liAudioDuration.setAttribute("t-duration", `${totalMin} : ${totalSec}`);
  });
}

//working on playing particular song on click
const allLiTags = ulTag.querySelectorAll("li");
function playingNow() {
  for (let j = 0; j < allLiTags.length; j++) {
    let audioTag = allLiTags[j].querySelector(".audio-duration");

    if (allLiTags[j].classList.contains("playing")) {
      allLiTags[j].classList.remove("playing");
      //getting that audio duration value and passing to .audio-duration innerText
      let adDuration = audioTag.getAttribute("t-duration");
      audioTag.innerText = adDuration; //passing t-duration value to audio duration innerText
    }

    if (allLiTags[j].getAttribute("li-index") == musicIndex) {
      //if there is an li tag which li-index is equal to musicIndex
      //then this music is playing now and lets style it
      allLiTags[j].classList.add("playing");
      audioTag.innerText = "Playing";
    }

    //adding onclick attribute in all li tags
    allLiTags[j].setAttribute("onclick", "clicked(this)");
  }
}

//now playing song on click
function clicked(element) {
  //getting li index of particular clicked li tag
  let getLiIndex = element.getAttribute("li-index");
  musicIndex = getLiIndex; //passing that liindex to music index
  loadMusic(musicIndex);
  playMusic();
  playingNow();
}
