<script setup>
import { onMounted, ref } from 'vue'

const props = defineProps({
  names: {
    type: Array,
    default: () => ['JEFT', 'BUVAK'],
  },
  discordId: {
    type: String,
    default: '828344938944921630',
  },
  location: {
    type: String,
    default: 'BURSA',
  },
  discordUsername: {
    type: String,
    default: '',
  },
  instagramUrl: {
    type: String,
    default: 'https://www.instagram.com/burak._.tmr8/',
  },
  spotifyUrl: {
    type: String,
    default: 'https://open.spotify.com/user/btsxr9443erco2g850ytb4jv4?si=ad579d1d308b4387',
  },
  avatarUrl: {
    type: String,
    default: '',
  },
  bgVideoUrl: {
    type: String,
    default: '',
  },
})

// State
const showTooltip = ref(false)
const visitorCount = ref('...')
const displayText = ref('')
let textIndex = 0
let isDeleting = false
let charIndex = 0
const lastGameActivity = ref(null)

if (import.meta.client) {
  lastGameActivity.value = JSON.parse(localStorage.getItem(`last_game_activity_${props.discordId}`)) || null
}

// Refs
const cardRef = ref(null)

// Discord copy function
async function copyDiscord() {
  try {
    await navigator.clipboard.writeText(props.discordUsername)
    showTooltip.value = true
    setTimeout(() => {
      showTooltip.value = false
    }, 2000)
  }
  catch (err) {
    console.error('Kopyalama başarısız: ', err)
  }
}

// Visitor counter function
async function fetchVisitorCount() {
  const STORAGE_KEY = `visit_count_${props.discordId}`
  const BASE_COUNT = props.initialVisitorCount

  try {
    const response = await fetch(`https://api.counterapi.dev/v1/webfriends-${props.discordId}/visits/up?t=${Date.now()}`)
    if (!response.ok)
      throw new Error('API blocked or down')

    const data = await response.json()
    visitorCount.value = data.count.toLocaleString('tr-TR')
    localStorage.setItem(STORAGE_KEY, data.count)
  }
  catch {
    let currentLocalCount = Number.parseInt(localStorage.getItem(STORAGE_KEY) || BASE_COUNT.toString())
    currentLocalCount++
    localStorage.setItem(STORAGE_KEY, currentLocalCount.toString())
    visitorCount.value = currentLocalCount.toLocaleString('tr-TR')
  }
}

function handleMouseMove(e) {
  if (!cardRef.value)
    return

  const card = cardRef.value
  const centerX = window.innerWidth / 2
  const centerY = window.innerHeight / 2
  const mouseX = e.clientX
  const mouseY = e.clientY

  const deltaX = (mouseX - centerX) / centerX
  const deltaY = (mouseY - centerY) / centerY

  const rotateX = -deltaY * 10
  const rotateY = deltaX * 10

  card.style.setProperty('--rx', `${rotateX}deg`)
  card.style.setProperty('--ry', `${rotateY}deg`)
}

function typeEffect() {
  const currentText = props.names[textIndex]
  const currentSpeed = isDeleting ? 100 : 200

  if (!isDeleting && charIndex < currentText.length) {
    displayText.value += currentText[charIndex]
    charIndex++
  }
  else if (isDeleting && charIndex > 0) {
    displayText.value = displayText.value.substring(0, charIndex - 1)
    charIndex--
  }

  if (charIndex === currentText.length) {
    isDeleting = true
    setTimeout(typeEffect, 2000)
    return
  }
  else if (isDeleting && charIndex === 0) {
    isDeleting = false
    textIndex = (textIndex + 1) % props.names.length
    setTimeout(typeEffect, 500)
    return
  }

  setTimeout(typeEffect, currentSpeed)
}

const lanyardData = ref(null)

function connectLanyard() {
  const socket = new WebSocket('wss://api.lanyard.rest/socket')

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data)

    if (data.op === 1) {
      socket.send(JSON.stringify({
        op: 2,
        d: { subscribe_to_id: props.discordId },
      }))

      setInterval(() => {
        socket.send(JSON.stringify({ op: 3 }))
      }, data.d.heartbeat_interval)
    }

    if (data.t === 'INIT_STATE' || data.t === 'PRESENCE_UPDATE') {
      lanyardData.value = data.d
      const currentGame = data.d?.activities?.find(a => a.type !== 4 && a.name !== 'Spotify')
      if (currentGame) {
        const activityToStore = {
          name: currentGame.name,
          details: currentGame.details || 'Playing',
          timestamp: Date.now(),
        }
        lastGameActivity.value = activityToStore
        localStorage.setItem(`last_game_activity_${props.discordId}`, JSON.stringify(activityToStore))
      }
    }
  }

  socket.onclose = () => {
    setTimeout(connectLanyard, 5000)
  }
}

function timeAgo(timestamp) {
  if (!timestamp)
    return 'önce'
  const seconds = Math.floor((Date.now() - timestamp) / 1000)
  if (seconds < 60)
    return 'saniyeler önce'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60)
    return `${minutes}dk önce`
  const hours = Math.floor(minutes / 60)
  if (hours < 24)
    return `${hours}sa önce`
  return `${Math.floor(hours / 24)}g önce`
}

const lastSeenText = ref('')
function updateLastSeen() {
  if (lastGameActivity.value && lastGameActivity.value.timestamp) {
    lastSeenText.value = timeAgo(lastGameActivity.value.timestamp)
  }
}

onMounted(() => {
  fetchVisitorCount()
  typeEffect()
  connectLanyard()
  updateLastSeen()
  setInterval(updateLastSeen, 60000)
})

function getDiscordStatus(status) {
  switch (status) {
    case 'dnd': return 'Rahatsız Etmeyin'
    case 'online': return 'Çevrimiçi'
    case 'idle': return 'Boşta'
    case 'offline': return 'Çevrimdışı'
    default: return status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Çevrimdışı'
  }
}
</script>

<template>
  <div
    id="main-content"
    @mousemove="handleMouseMove"
  >
    <video
      v-if="bgVideoUrl"
      id="bg-video"
      :key="bgVideoUrl"
      :src="bgVideoUrl"
      autoplay
      loop
      muted
      playsinline
    />
    <div class="overlay" />

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
              <div class="main-avatar" :style="avatarUrl ? { background: `url(${avatarUrl}) center/cover no-repeat` } : { background: 'rgba(255,255,255,0.1)' }">
                <i v-if="!avatarUrl" class="fas fa-user" style="font-size: 2rem; color: var(--secondary);" />
              </div>
              <div v-if="lanyardData" class="main-status-dot" :class="lanyardData.discord_status" />
            </div>

            <div class="username-group">
              <h1 class="username">
                {{ displayText }}<span class="cursor">|</span>
              </h1>
              <!-- Integrated Spotify Mini-Art -->
              <div v-if="lanyardData && lanyardData.listening_to_spotify" class="mini-music-status">
                <img :src="lanyardData.spotify.album_art_url" class="mini-album-art" alt="Spotify">
                <div class="music-tooltip">
                  {{ lanyardData.spotify.song }} - {{ lanyardData.spotify.artist }}
                </div>
              </div>
            </div>
          </div>

          <!-- MIDDLE: Live or Last Game Activity -->
          <div v-if="lanyardData" class="single-activity-row">
            <div class="activity-chip game-chip">
              <div class="chip-icon">
                <i :class="(lanyardData.activities.find(a => a.type !== 4 && a.name !== 'Spotify') || lastGameActivity) ? 'fas fa-gamepad' : 'fab fa-discord'" />
              </div>
              <div class="chip-info">
                <span class="chip-name">
                  {{ lanyardData.activities.find(a => a.type !== 4 && a.name !== 'Spotify')?.name || lastGameActivity?.name || 'Discord' }}
                </span>
                <span class="chip-sub">
                  {{ lanyardData.activities.find(a => a.type !== 4 && a.name !== 'Spotify') ? (lanyardData.activities.find(a => a.type !== 4 && a.name !== 'Spotify').details || 'Şu an oynuyor') : (lastGameActivity ? (lastSeenText ? `Son oynanan: ${lastSeenText}` : 'Çevrimdışı') : getDiscordStatus(lanyardData.discord_status)) }}
                </span>
              </div>
            </div>
          </div>

          <!-- BOTTOM: Socials + Info -->
          <div class="card-footer-section">
            <div class="social-links-row">
              <button class="social-button" @click="copyDiscord">
                <i class="fab fa-discord" />
                <div class="tooltip-box" :class="{ visible: showTooltip }">
                  Kopyalandı!
                </div>
              </button>
              <a :href="props.instagramUrl" target="_blank" class="social-button">
                <i class="fab fa-instagram" />
              </a>
              <a :href="props.spotifyUrl" target="_blank" class="social-button">
                <i class="fab fa-spotify" />
              </a>
            </div>

            <div class="stats-badges">
              <div class="badge-item">
                <i class="far fa-eye" />
                <span>{{ visitorCount }}</span>
              </div>
              <div class="vertical-line" />
              <div class="badge-item">
                <i class="fas fa-map-marker-alt" />
                <span>{{ props.location }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
#main-content {
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
}
</style>
