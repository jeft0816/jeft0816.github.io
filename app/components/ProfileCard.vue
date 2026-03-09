<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { timeAgo } from '~/utils/timeAgo'

interface LanyardActivity {
  type: number
  name: string
  details?: string
}

interface LanyardSpotify {
  album_art_url: string
  song: string
  artist: string
}

interface LanyardPresence {
  discord_status?: string
  activities?: LanyardActivity[]
  listening_to_spotify?: boolean
  spotify?: LanyardSpotify
}

interface LastGameActivity {
  name: string
  details: string
  timestamp: number
}

interface LastSpotifyTrack extends LanyardSpotify {
  timestamp: number
}

interface GatewayEvent {
  op?: number
  t?: 'INIT_STATE' | 'PRESENCE_UPDATE'
  d?: unknown
}

const props = withDefaults(defineProps<{
  names?: string[]
  discordId?: string
  location?: string
  discordUsername?: string
  instagramUrl?: string
  spotifyUrl?: string
  avatarUrl?: string
  bgVideoUrl?: string
}>(), {
  names: () => ['JEFT', 'BUVAK'],
  discordId: '828344938944921630',
  location: 'BURSA',
  discordUsername: '',
  instagramUrl: 'https://www.instagram.com/burak._.tmr8/',
  spotifyUrl: 'https://open.spotify.com/user/btsxr9443erco2g850ytb4jv4?si=ad579d1d308b4387',
  avatarUrl: '',
  bgVideoUrl: '',
})

const showTooltip = ref(false)
const displayText = ref('')
const cardRef = ref<HTMLElement | null>(null)
const lanyardData = ref<LanyardPresence | null>(null)
const lastGameActivity = ref<LastGameActivity | null>(null)
const lastSeenText = ref('')
const lastSpotifyTrack = ref<LastSpotifyTrack | null>(null)
const lastSpotifySeenText = ref('')

const gameStorageKey = computed(() => `last_game_activity_${props.discordId}`)
const spotifyStorageKey = computed(() => `last_spotify_track_${props.discordId}`)
const profileNames = computed(() => {
  const names = props.names.map(name => name.trim()).filter(Boolean)
  return names.length ? names : ['JEFT']
})

const currentActivity = computed(() =>
  (lanyardData.value?.activities || []).find(activity => activity.type !== 4 && activity.name !== 'Spotify'),
)
const isListeningToSpotify = computed(() =>
  Boolean(lanyardData.value?.listening_to_spotify && lanyardData.value.spotify),
)
const displayedSpotifyTrack = computed(() =>
  isListeningToSpotify.value ? (lanyardData.value?.spotify ?? null) : lastSpotifyTrack.value,
)

let textIndex = 0
let charIndex = 0
let isDeleting = false
let socket: WebSocket | null = null
let isUnmounted = false

let typewriterTimeout: ReturnType<typeof setTimeout> | null = null
let tooltipTimeout: ReturnType<typeof setTimeout> | null = null
let reconnectTimeout: ReturnType<typeof setTimeout> | null = null
let heartbeatInterval: ReturnType<typeof setInterval> | null = null
let lastSeenInterval: ReturnType<typeof setInterval> | null = null

function loadLastGameActivity() {
  if (!import.meta.client)
    return

  try {
    const raw = localStorage.getItem(gameStorageKey.value)
    if (!raw)
      return

    const parsed = JSON.parse(raw) as Partial<LastGameActivity>
    if (typeof parsed?.name === 'string' && typeof parsed?.timestamp === 'number') {
      lastGameActivity.value = {
        name: parsed.name,
        details: typeof parsed.details === 'string' ? parsed.details : 'Playing',
        timestamp: parsed.timestamp,
      }
    }
  }
  catch {
    lastGameActivity.value = null
  }
}

function saveLastGameActivity(activity: LastGameActivity) {
  if (!import.meta.client)
    return

  try {
    localStorage.setItem(gameStorageKey.value, JSON.stringify(activity))
  }
  catch {
    // Storage failures should not block UI.
  }
}

function loadLastSpotifyTrack() {
  if (!import.meta.client)
    return

  try {
    const raw = localStorage.getItem(spotifyStorageKey.value)
    if (!raw)
      return

    const parsed = JSON.parse(raw) as Partial<LastSpotifyTrack>
    if (typeof parsed?.song === 'string' && typeof parsed?.artist === 'string' && typeof parsed?.timestamp === 'number') {
      lastSpotifyTrack.value = {
        song: parsed.song,
        artist: parsed.artist,
        album_art_url: typeof parsed.album_art_url === 'string' ? parsed.album_art_url : '',
        timestamp: parsed.timestamp,
      }
    }
  }
  catch {
    lastSpotifyTrack.value = null
  }
}

function saveLastSpotifyTrack(track: LastSpotifyTrack) {
  if (!import.meta.client)
    return

  try {
    localStorage.setItem(spotifyStorageKey.value, JSON.stringify(track))
  }
  catch {
    // Storage failures should not block UI.
  }
}

async function copyDiscord() {
  if (!import.meta.client || !props.discordUsername)
    return

  try {
    await navigator.clipboard.writeText(props.discordUsername)
    showTooltip.value = true

    if (tooltipTimeout)
      clearTimeout(tooltipTimeout)

    tooltipTimeout = setTimeout(() => {
      showTooltip.value = false
      tooltipTimeout = null
    }, 2000)
  }
  catch {
    // Clipboard can fail when page is not focused or permissions are denied.
  }
}

function handleMouseMove(event: MouseEvent) {
  if (!cardRef.value)
    return

  const centerX = window.innerWidth / 2
  const centerY = window.innerHeight / 2
  const deltaX = (event.clientX - centerX) / centerX
  const deltaY = (event.clientY - centerY) / centerY

  cardRef.value.style.setProperty('--rx', `${-deltaY * 10}deg`)
  cardRef.value.style.setProperty('--ry', `${deltaX * 10}deg`)
}

function scheduleTypeEffect(delay: number) {
  if (typewriterTimeout)
    clearTimeout(typewriterTimeout)

  typewriterTimeout = setTimeout(() => {
    typewriterTimeout = null
    typeEffect()
  }, delay)
}

function typeEffect() {
  const names = profileNames.value
  const currentText = names[textIndex] || names[0]
  if (!currentText)
    return

  const speed = isDeleting ? 80 : 140

  if (!isDeleting && charIndex < currentText.length) {
    displayText.value += currentText[charIndex]
    charIndex++
  }
  else if (isDeleting && charIndex > 0) {
    displayText.value = displayText.value.slice(0, -1)
    charIndex--
  }

  if (charIndex === currentText.length) {
    isDeleting = true
    scheduleTypeEffect(1500)
    return
  }

  if (isDeleting && charIndex === 0) {
    isDeleting = false
    textIndex = (textIndex + 1) % names.length
    scheduleTypeEffect(400)
    return
  }

  scheduleTypeEffect(speed)
}

function parseGatewayEvent(rawMessage: string): GatewayEvent | null {
  try {
    return JSON.parse(rawMessage) as GatewayEvent
  }
  catch {
    return null
  }
}

function startHeartbeat(interval: number) {
  if (heartbeatInterval)
    clearInterval(heartbeatInterval)

  heartbeatInterval = setInterval(() => {
    if (socket?.readyState === WebSocket.OPEN)
      socket.send(JSON.stringify({ op: 3 }))
  }, interval)
}

function updatePresence(presence: LanyardPresence) {
  lanyardData.value = presence

  if (presence.listening_to_spotify && presence.spotify?.song && presence.spotify.artist) {
    const trackToStore: LastSpotifyTrack = {
      song: presence.spotify.song,
      artist: presence.spotify.artist,
      album_art_url: presence.spotify.album_art_url || '',
      timestamp: Date.now(),
    }

    lastSpotifyTrack.value = trackToStore
    saveLastSpotifyTrack(trackToStore)
    updateLastSpotifySeen()
  }

  const currentGame = (presence.activities || []).find(activity => activity.type !== 4 && activity.name !== 'Spotify')
  if (currentGame?.name) {
    const activityToStore: LastGameActivity = {
      name: currentGame.name,
      details: currentGame.details || 'Playing',
      timestamp: Date.now(),
    }

    lastGameActivity.value = activityToStore
    saveLastGameActivity(activityToStore)
  }

  updateLastSeen()
}

function handleGatewayMessage(event: MessageEvent<string>) {
  const payload = parseGatewayEvent(event.data)
  if (!payload)
    return

  if (payload.op === 1) {
    const heartbeat = Number((payload.d as { heartbeat_interval?: number } | undefined)?.heartbeat_interval)
    if (Number.isFinite(heartbeat) && heartbeat > 0) {
      if (socket?.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({
          op: 2,
          d: { subscribe_to_id: props.discordId },
        }))
      }
      startHeartbeat(heartbeat)
    }
    return
  }

  if ((payload.t === 'INIT_STATE' || payload.t === 'PRESENCE_UPDATE') && payload.d)
    updatePresence(payload.d as LanyardPresence)
}

function scheduleReconnect() {
  if (isUnmounted)
    return

  if (reconnectTimeout)
    clearTimeout(reconnectTimeout)

  reconnectTimeout = setTimeout(() => {
    reconnectTimeout = null
    connectLanyard()
  }, 5000)
}

function connectLanyard() {
  if (!import.meta.client || isUnmounted)
    return

  if (socket && (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING))
    return

  socket = new WebSocket('wss://api.lanyard.rest/socket')

  socket.onmessage = event => handleGatewayMessage(event as MessageEvent<string>)

  socket.onerror = () => {
    socket?.close()
  }

  socket.onclose = () => {
    if (heartbeatInterval) {
      clearInterval(heartbeatInterval)
      heartbeatInterval = null
    }

    socket = null
    scheduleReconnect()
  }
}

function updateLastSeen() {
  if (!lastGameActivity.value?.timestamp) {
    lastSeenText.value = ''
    return
  }

  lastSeenText.value = timeAgo(lastGameActivity.value.timestamp)
}

function updateLastSpotifySeen() {
  if (!lastSpotifyTrack.value?.timestamp) {
    lastSpotifySeenText.value = ''
    return
  }

  lastSpotifySeenText.value = timeAgo(lastSpotifyTrack.value.timestamp)
}

function getDiscordStatus(status?: string) {
  switch (status) {
    case 'dnd':
      return 'Rahatsız Etmeyin'
    case 'online':
      return 'Çevrimiçi'
    case 'idle':
      return 'Boşta'
    case 'offline':
      return 'Çevrimdışı'
    default:
      return status ? `${status.charAt(0).toUpperCase()}${status.slice(1)}` : 'Çevrimdışı'
  }
}

onMounted(() => {
  loadLastGameActivity()
  loadLastSpotifyTrack()
  updateLastSeen()
  updateLastSpotifySeen()
  typeEffect()
  connectLanyard()

  lastSeenInterval = setInterval(() => {
    updateLastSeen()
    updateLastSpotifySeen()
  }, 60000)
})

onBeforeUnmount(() => {
  isUnmounted = true

  if (typewriterTimeout) {
    clearTimeout(typewriterTimeout)
    typewriterTimeout = null
  }

  if (tooltipTimeout) {
    clearTimeout(tooltipTimeout)
    tooltipTimeout = null
  }

  if (reconnectTimeout) {
    clearTimeout(reconnectTimeout)
    reconnectTimeout = null
  }

  if (heartbeatInterval) {
    clearInterval(heartbeatInterval)
    heartbeatInterval = null
  }

  if (lastSeenInterval) {
    clearInterval(lastSeenInterval)
    lastSeenInterval = null
  }

  if (socket) {
    socket.onclose = null
    socket.onerror = null
    socket.onmessage = null
    socket.close()
    socket = null
  }
})
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
              <div v-if="displayedSpotifyTrack" class="mini-music-status">
                <img :src="displayedSpotifyTrack.album_art_url" class="mini-album-art" alt="Spotify">
                <div class="music-tooltip">
                  {{ displayedSpotifyTrack.song }} - {{ displayedSpotifyTrack.artist }}{{ !isListeningToSpotify && lastSpotifySeenText ? ` • Son: ${lastSpotifySeenText}` : '' }}
                </div>
              </div>
            </div>
          </div>

          <div v-if="lanyardData" class="single-activity-row">
            <div class="activity-chip game-chip">
              <div class="chip-icon">
                <i :class="(currentActivity || lastGameActivity) ? 'fas fa-gamepad' : 'fab fa-discord'" />
              </div>
              <div class="chip-info">
                <span class="chip-name">
                  {{ currentActivity?.name || lastGameActivity?.name || 'Discord' }}
                </span>
                <span class="chip-sub">
                  {{ currentActivity ? (currentActivity.details || 'Şu an oynuyor') : (lastGameActivity ? (lastSeenText ? `Son oynanan: ${lastSeenText}` : 'Çevrimdışı') : getDiscordStatus(lanyardData.discord_status)) }}
                </span>
              </div>
            </div>
          </div>

          <div class="card-footer-section">
            <div class="social-links-row">
              <button type="button" class="social-button" aria-label="Discord kullanici adini kopyala" @click="copyDiscord">
                <i class="fab fa-discord" />
                <div class="tooltip-box" :class="{ visible: showTooltip }">
                  Kopyalandı!
                </div>
              </button>
              <a v-if="props.instagramUrl" :href="props.instagramUrl" target="_blank" rel="noopener noreferrer" class="social-button" aria-label="Instagram">
                <i class="fab fa-instagram" />
              </a>
              <a v-if="props.spotifyUrl" :href="props.spotifyUrl" target="_blank" rel="noopener noreferrer" class="social-button" aria-label="Spotify">
                <i class="fab fa-spotify" />
              </a>
            </div>

            <div class="stats-badges">
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
