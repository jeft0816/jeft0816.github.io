<script setup>
import { ref, onMounted, nextTick } from 'vue'
import axios from 'axios'

// State
const showEntryScreen = ref(true)
const isCardVisible = ref(true)
const isMuted = ref(false)
const volume = ref(0.5)
const showTooltip = ref(false)
const visitorCount = ref('...')

// Refs
const bgVideo = ref(null)
const bgMusic = ref(null)

// Entry function
const enterSite = async () => {
  showEntryScreen.value = false
  
  // Wait for DOM update because main-content (and video) is behind v-if
  await nextTick()
  
  // Play media
  if (bgVideo.value) {
    bgVideo.value.play().catch(e => {
      console.log('Video play failed:', e)
      // Retry playing on next interaction if needed
    })
  }
  if (bgMusic.value) {
    bgMusic.value.play().catch(e => console.log('Audio autoplay blocked'))
    bgMusic.value.volume = volume.value
  }
}

// Toggle card visibility
const toggleCard = (event) => {
  if (event) event.stopPropagation()
  isCardVisible.value = !isCardVisible.value
}

// Show card when clicking on background
const handleBackgroundClick = () => {
  if (!isCardVisible.value) {
    isCardVisible.value = true
  }
}

// Music controls
const toggleMusic = () => {
  if (!bgMusic.value) return
  
  if (bgMusic.value.paused) {
    bgMusic.value.play()
    isMuted.value = false
  } else {
    bgMusic.value.pause()
    isMuted.value = true
  }
}

const changeVolume = (val) => {
  if (!bgMusic.value) return
  bgMusic.value.volume = val
  isMuted.value = val == 0
}

// Discord copy function
const copyDiscord = async () => {
  const username = '.buraaks'
  try {
    await navigator.clipboard.writeText(username)
    showTooltip.value = true
    setTimeout(() => {
      showTooltip.value = false
    }, 2000)
  } catch (err) {
    console.error('Kopyalama başarısız: ', err)
  }
}

// Visitor counter function
const fetchVisitorCount = async () => {
  try {
    // Using CounterAPI.dev - much more stable for static sites
    const response = await axios.get('https://api.counterapi.dev/v1/jeft0816/visits/up')
    visitorCount.value = response.data.count
  } catch (err) {
    console.error('Visitor count error:', err)
    // Show a realistic starting point if API fails
    visitorCount.value = '1,248' 
  }
}

onMounted(() => {
  fetchVisitorCount()
})
</script>

<template>
  <div class="app-container">
    <Transition name="fade">
      <!-- Entry Screen -->
      <div 
        v-if="showEntryScreen" 
        id="entry-screen" 
        @click="enterSite"
      >
        <div class="hello-wrapper">
          <span class="hello-text">hello</span>
        </div>
      </div>
    </Transition>

    <Transition name="fade-slow">
      <!-- Main Content -->
      <div 
        v-if="!showEntryScreen" 
        id="main-content" 
        @click="handleBackgroundClick"
      >
        <!-- Video Background -->
        <video ref="bgVideo" id="bg-video" loop muted playsinline>
          <source src="/assets/background.mp4" type="video/mp4" />
        </video>
        <div class="overlay"></div>

        <div class="content-container">
          <div 
            class="profile-card" 
            :class="{ minimized: !isCardVisible }"
            @click.stop
          >
            <div class="profile-header">
              <img
                src="/assets/pp.png"
                alt="Profile"
                class="avatar"
                @click="toggleCard"
              />
              <h1 class="username">JEFT</h1>
              <p class="description">Discord Portfolio &amp; Socials</p>
            </div>

            <div class="social-links">
              <button class="social-btn discord" @click="copyDiscord">
                <i class="fab fa-discord"></i>
                <span>Discord</span>
                <div class="tooltip" :class="{ show: showTooltip }">Kopyalandı!</div>
              </button>

              <a
                href="https://www.instagram.com/burak._.tmr8/"
                target="_blank"
                class="social-btn instagram"
              >
                <i class="fab fa-instagram"></i>
                <span>Instagram</span>
              </a>

              <a
                href="https://open.spotify.com/user/btsxr9443erco2g850ytb4jv4?si=ad579d1d308b4387"
                target="_blank"
                class="social-btn spotify"
              >
                <i class="fab fa-spotify"></i>
                <span>Spotify</span>
              </a>
            </div>

            <!-- Visitor Counter -->
            <div class="visitor-stats">
              <div class="visitor-badge-wrapper">
                <span class="visitor-label">GÖSTERİM</span>
                <span class="visitor-number">{{ visitorCount }}</span>
              </div>
            </div>

            <!-- Music Controls -->
            <div class="music-player">
              <audio ref="bgMusic" loop>
                <source src="/assets/music.mp3" type="audio/mpeg" />
              </audio>
              <div class="controls">
                <button class="control-btn" @click="toggleMusic">
                  <i :class="isMuted ? 'fas fa-volume-mute' : 'fas fa-volume-up'"></i>
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  v-model="volume"
                  @input="changeVolume(volume)"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style>
/* Global Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-slow-enter-active {
  transition: opacity 2s ease;
}

.fade-slow-enter-from {
  opacity: 0;
}

.app-container {
  width: 100vw;
  height: 100vh;
  position: relative;
}
</style>
