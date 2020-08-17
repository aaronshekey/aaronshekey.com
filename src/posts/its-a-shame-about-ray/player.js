class Track {
  constructor(trackNumber) {
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    this.playing = false;
    this.originalAudioElement = document.querySelector(`audio.track-${trackNumber}.original`);
    this.originalGainNode = this.audioContext.createGain();
    this.originalSource = this.audioContext.createMediaElementSource(this.originalAudioElement);
    this.y = this.originalSource.connect(this.originalGainNode).connect(this.audioContext.destination);

    this.coverAudioElement = document.querySelector(`audio.track-${trackNumber}.cover`);
    this.coverGainNode = this.audioContext.createGain();
    this.coverSource = this.audioContext.createMediaElementSource(this.coverAudioElement);
    this.x = this.coverSource.connect(this.coverGainNode).connect(this.audioContext.destination);
  }

  playOrPause() {
    if (this.audioContext.state === "suspended") {
      this.audioContext.resume();
    }
    if (this.playing) {
      this.originalAudioElement.pause();
      this.coverAudioElement.pause();
      this.playing = false;
    } else {
      this.originalAudioElement.play();
      this.coverAudioElement.play();
      this.playing = true;
    }
  }

  adjustCrossfade(value) {
    const gain = value / 100;
    this.originalGainNode.gain.value = 1 - gain;
    this.coverGainNode.gain.value = gain;
  }

  disconnect() {
    this.originalAudioElement.pause();
    this.originalAudioElement.currentTime = 0;
    this.coverAudioElement.pause();
    this.coverAudioElement.currentTime = 0;
    this.playing = false;
  }
}

const main = function () {
  const crossfader = document.querySelector("#crossfader");
  const playButton = document.querySelector("#play");
  const tracks = {};
  tracks[1] = new Track(1);
  let activeTrack = tracks[1];
  activeTrack.adjustCrossfade(crossfader.value);

  document.querySelectorAll("button.track").forEach((button) => {
    button.addEventListener("click", () => {
      activeTrack.disconnect();
      if (!tracks[button.dataset.track]) {
        tracks[button.dataset.track] = new Track(button.dataset.track);
      }
      activeTrack = tracks[button.dataset.track];
      activeTrack.playOrPause();
      activeTrack.adjustCrossfade(crossfader.value);
    });
  });

  playButton.addEventListener("click", () => {
    activeTrack.playOrPause();
  });

  crossfader.addEventListener("input", function () {
    activeTrack.adjustCrossfade(crossfader.value);
  });
};

main();
