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
const displayText = ref('')
const fullText = 'JEFT'
let isDeleting = false
let charIndex = 0
let typeSpeed = 200

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
  const STORAGE_KEY = 'jeft_visit_count'
  const BASE_COUNT = 1350 // Başlangıç taban sayısı

  try {
    // API'den gerçek sayıyı çekmeye çalış
    const response = await fetch(`https://api.counterapi.dev/v1/jeft0816-portfolio/visits/up?t=${Date.now()}`)
    if (!response.ok) throw new Error('API blocked or down')
    
    const data = await response.json()
    visitorCount.value = data.count.toLocaleString('tr-TR')
    localStorage.setItem(STORAGE_KEY, data.count)
  } catch (err) {
    console.warn('Sayaç servis bağlantısı reklam engelleyici tarafından engellendi. Yerel mod çalışıyor.')
    
    // Eğer API engellenmişse (Adblocker vb.), cihaz hafızasından devam et
    let currentLocalCount = parseInt(localStorage.getItem(STORAGE_KEY) || BASE_COUNT)
    currentLocalCount++
    localStorage.setItem(STORAGE_KEY, currentLocalCount)
    
    visitorCount.value = currentLocalCount.toLocaleString('tr-TR')
  }
}

const cardRef = ref(null)

const handleMouseMove = (e) => {
  if (!cardRef.value || !isCardVisible.value) return
  
  const card = cardRef.value
  const rect = card.getBoundingClientRect()
  
  // Ekran merkezine veya kart merkezine göre hesaplama yapalım
  const centerX = window.innerWidth / 2
  const centerY = window.innerHeight / 2
  
  const mouseX = e.clientX
  const mouseY = e.clientY
  
  // Merkeze olan uzaklık oranı (-1 ile 1 arası)
  const deltaX = (mouseX - centerX) / centerX
  const deltaY = (mouseY - centerY) / centerY
  
  // Maksimum 10 derece eğim (ekranın her yerinde çalıştığı için biraz arttırdım)
  const rotateX = -deltaY * 10
  const rotateY = deltaX * 10
  
  card.style.setProperty('--rx', `${rotateX}deg`)
  card.style.setProperty('--ry', `${rotateY}deg`)
}

const resetTransform = () => {
  if (!cardRef.value) return
  cardRef.value.style.setProperty('--rx', '0deg')
  cardRef.value.style.setProperty('--ry', '0deg')
}

const typeEffect = () => {
  const currentSpeed = isDeleting ? 100 : 200
  
  if (!isDeleting && charIndex < fullText.length) {
    displayText.value += fullText[charIndex]
    charIndex++
  } else if (isDeleting && charIndex > 0) {
    displayText.value = displayText.value.substring(0, charIndex - 1)
    charIndex--
  }

  if (charIndex === fullText.length) {
    isDeleting = true
    setTimeout(typeEffect, 2000) // Tam yazıldıktan sonra bekleme
    return
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false
    setTimeout(typeEffect, 500) // Tam silindikten sonra bekleme
    return
  }

  setTimeout(typeEffect, currentSpeed)
}

onMounted(() => {
  fetchVisitorCount()
  typeEffect()
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
        @mousemove="handleMouseMove"
      >
        <!-- Video Background -->
        <video ref="bgVideo" id="bg-video" loop muted playsinline>
          <source src="/assets/background.mp4" type="video/mp4" />
        </video>
        <div class="overlay"></div>

        <div class="content-container">
          <div 
            ref="cardRef"
            class="profile-card" 
            :class="{ minimized: !isCardVisible }"
            @click.stop
          >
            <!-- Visitor Counter (Top Right) -->
            <div class="visitor-stats">
              <div class="visitor-badge-wrapper">
                <i class="far fa-eye"></i>
                <span class="visitor-number">{{ visitorCount }}</span>
              </div>
            </div>

            <div class="profile-header">
              <img
                src="/assets/pp.png"
                alt="Profile"
                class="avatar"
                @click="toggleCard"
              />
              <h1 class="username">
                {{ displayText }}<span class="cursor">|</span>
              </h1>
            </div>

            <div class="social-links">
              <button class="social-btn discord" @click="copyDiscord">
                <i class="fab fa-discord"></i>
                <div class="tooltip" :class="{ show: showTooltip }">Kopyalandı!</div>
              </button>

              <a
                href="https://www.instagram.com/burak._.tmr8/"
                target="_blank"
                class="social-btn instagram"
              >
                <i class="fab fa-instagram"></i>
              </a>

              <a
                href="https://open.spotify.com/user/btsxr9443erco2g850ytb4jv4?si=ad579d1d308b4387"
                target="_blank"
                class="social-btn spotify"
              >
                <i class="fab fa-spotify"></i>
              </a>
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
