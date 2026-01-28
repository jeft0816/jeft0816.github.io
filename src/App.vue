<script setup>
import { ref, onMounted, nextTick } from 'vue'
import axios from 'axios'

// State
const showEntryScreen = ref(true)
const isMuted = ref(false)
const volume = ref(0.5)
const showTooltip = ref(false)
const visitorCount = ref('...')
const displayText = ref('')
const fullText = 'JEFT'
let isDeleting = false
let charIndex = 0
let typeSpeed = 200
const lastGameActivity = ref(JSON.parse(localStorage.getItem('last_game_activity')) || null)

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
  const username = 'jeft._.'
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
  if (!cardRef.value) return
  
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

const lanyardData = ref(null)
const DISCORD_ID = '828344938944921630'

const connectLanyard = () => {
  const socket = new WebSocket('wss://api.lanyard.rest/socket')

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data)

    if (data.op === 1) {
      socket.send(JSON.stringify({
        op: 2,
        d: { subscribe_to_id: DISCORD_ID }
      }))

      setInterval(() => {
        socket.send(JSON.stringify({ op: 3 }))
      }, data.d.heartbeat_interval)
    }

    if (data.t === 'INIT_STATE' || data.t === 'PRESENCE_UPDATE') {
      lanyardData.value = data.d
      
      // Update last played game activity if current one is a game/app (not Spotify/Custom)
      const currentGame = data.d.activities.find(a => a.type !== 4 && a.name !== 'Spotify')
      if (currentGame) {
        const activityToStore = {
          name: currentGame.name,
          details: currentGame.details || 'Playing',
          timestamp: Date.now()
        }
        lastGameActivity.value = activityToStore
        localStorage.setItem('last_game_activity', JSON.stringify(activityToStore))
      }
    }
  }

  socket.onclose = () => {
    setTimeout(connectLanyard, 5000)
  }
}

// Utility for relative time
const timeAgo = (timestamp) => {
  if (!timestamp) return 'Previously'
  const seconds = Math.floor((Date.now() - timestamp) / 1000)
  if (seconds < 60) return 'seconds ago'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

const lastSeenText = ref('')
const updateLastSeen = () => {
  if (lastGameActivity.value && lastGameActivity.value.timestamp) {
    lastSeenText.value = timeAgo(lastGameActivity.value.timestamp)
  }
}

onMounted(() => {
  fetchVisitorCount()
  typeEffect()
  connectLanyard()
  
  // Update relative time every minute
  updateLastSeen()
  setInterval(updateLastSeen, 60000)
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
        v-show="!showEntryScreen" 
        id="main-content" 
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
            @click.stop
          >


            <div class="card-stack-layout">
              <!-- TOP: Avatar + Nickname & Integrated Music -->
              <div class="identity-header">
                <div class="main-avatar-wrapper">
                  <img
                    src="/assets/pp.png"
                    alt="Profile"
                    class="main-avatar"
                    fetchpriority="high"
                    loading="eager"
                  />
                  <div v-if="lanyardData" class="main-status-dot" :class="lanyardData.discord_status"></div>
                </div>
                
                <div class="username-group">
                  <h1 class="username">
                    {{ displayText }}<span class="cursor">|</span>
                  </h1>
                  <!-- Integrated Spotify Mini-Art -->
                  <div v-if="lanyardData && lanyardData.listening_to_spotify" class="mini-music-status">
                    <img :src="lanyardData.spotify.album_art_url" class="mini-album-art" alt="Spotify" />
                    <div class="music-tooltip">
                      {{ lanyardData.spotify.song }} - {{ lanyardData.spotify.artist }}
                    </div>
                  </div>
                </div>
              </div>

              <!-- MIDDLE: Live or Last Game Activity -->
              <div v-if="lanyardData && (lanyardData.activities.find(a => a.type !== 4 && a.name !== 'Spotify') || lastGameActivity)" class="single-activity-row">
                <div class="activity-chip game-chip">
                  <div class="chip-icon"><i class="fas fa-gamepad"></i></div>
                  <div class="chip-info">
                    <!-- Show current game if exists, otherwise show last played from storage -->
                    <span class="chip-name">
                      {{ lanyardData.activities.find(a => a.type !== 4 && a.name !== 'Spotify')?.name || lastGameActivity.name }}
                    </span>
                    <span class="chip-sub">
                      {{ lanyardData.activities.find(a => a.type !== 4 && a.name !== 'Spotify') ? (lanyardData.activities.find(a => a.type !== 4 && a.name !== 'Spotify').details || 'Playing Now') : lastSeenText }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- BOTTOM: Socials + Info -->
              <div class="card-footer-section">
                <div class="social-links-row">
                  <button class="social-button" @click="copyDiscord">
                    <i class="fab fa-discord"></i>
                    <div class="tooltip-box" :class="{ visible: showTooltip }">Kopyalandı!</div>
                  </button>
                  <a href="https://www.instagram.com/burak._.tmr8/" target="_blank" class="social-button">
                    <i class="fab fa-instagram"></i>
                  </a>
                  <a href="https://open.spotify.com/user/btsxr9443erco2g850ytb4jv4?si=ad579d1d308b4387" target="_blank" class="social-button">
                    <i class="fab fa-spotify"></i>
                  </a>
                </div>

                <div class="stats-badges">
                  <div class="badge-item">
                    <i class="far fa-eye"></i>
                    <span>{{ visitorCount }}</span>
                  </div>
                  <div class="vertical-line"></div>
                  <div class="badge-item">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>BURSA</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Hidden Audio -->
            <audio ref="bgMusic" loop>
              <source src="/assets/music.mp3" type="audio/mpeg" />
            </audio>
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
