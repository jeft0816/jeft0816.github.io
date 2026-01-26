const entryScreen = document.getElementById("entry-screen");
const mainContent = document.getElementById("main-content");
const bgVideo = document.getElementById("bg-video");
const bgMusic = document.getElementById("bg-music");
const muteIcon = document.getElementById("mute-icon");
const volumeSlider = document.getElementById("volume-slider");

// Entry Function
entryScreen.addEventListener("click", () => {
  // Hide entry screen
  entryScreen.style.opacity = "0";
  entryScreen.style.visibility = "hidden";

  // Show main content
  mainContent.classList.remove("hidden");

  // Play media
  bgVideo.play().catch((e) => console.log("Video autoplay blocked"));
  bgMusic.play().catch((e) => console.log("Audio autoplay blocked"));

  // Initial volume
  bgMusic.volume = volumeSlider.value;
});

// Music Controls
function toggleMusic() {
  if (bgMusic.paused) {
    bgMusic.play();
    muteIcon.className = "fas fa-volume-up";
  } else {
    bgMusic.pause();
    muteIcon.className = "fas fa-volume-mute";
  }
}

function changeVolume(val) {
  bgMusic.volume = val;
  if (val == 0) {
    muteIcon.className = "fas fa-volume-mute";
  } else {
    muteIcon.className = "fas fa-volume-up";
  }
}

// Discord Copy Function
function copyDiscord() {
  const username = ".buraaks";
  navigator.clipboard
    .writeText(username)
    .then(() => {
      const tooltip = document.getElementById("discord-tooltip");
      tooltip.classList.add("show");

      setTimeout(() => {
        tooltip.classList.remove("show");
      }, 2000);
    })
    .catch((err) => {
      console.error("Kopyalama başarısız: ", err);
    });
}

// Toggle Minimize Function
function toggleMinimize() {
  const card = document.getElementById("profile-card");
  card.classList.toggle("minimized");
}

// Fade in main content on load if needed or handle refresh
window.addEventListener("load", () => {
  // Ensuring things are ready
});
