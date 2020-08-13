const audioContext = new AudioContext();

const audioElement = document.querySelector(".track-2.original");
const track = audioContext.createMediaElementSource(audioElement);
track.connect(audioContext.destination);

const playButton = document.querySelector("#play");

playButton.addEventListener("click", function() {
  if (audioContext.state === "suspended") {
    audioContext.resume();
  }

  if (!this.dataset.playing || this.dataset.playing === "false") {
    audioElement.play();
    this.dataset.playing = true;
  } else {
    audioElement.pause();
    this.dataset.playing = false;
  }
});

audioElement.addEventListener("ended", () => {
  playButton.dataset.playing = "false";
});
