import { Buffer } from 'node:buffer'

export default defineEventHandler(async (_event) => {
  const config = useRuntimeConfig()
  const clientId = config.spotifyClientId as string
  const clientSecret = config.spotifyClientSecret as string
  const refreshToken = config.spotifyRefreshToken as string

  if (!clientId || !clientSecret || !refreshToken) {
    return { isPlaying: false, track: null }
  }

  try {
    const token = await $fetch<{ access_token: string }>('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      }),
    })

    const nowPlaying = await $fetch.raw('https://api.spotify.com/v1/me/player/currently-playing', {
      headers: {
        Authorization: `Bearer ${token.access_token}`,
      },
    })

    if (nowPlaying.status === 204 || !nowPlaying._data) {
      return { isPlaying: false, track: null }
    }

    const data = nowPlaying._data as {
      is_playing?: boolean
      timestamp?: number
      item?: {
        name?: string
        external_urls?: { spotify?: string }
        artists?: Array<{ name?: string }>
        album?: { images?: Array<{ url?: string }> }
      }
    }

    if (!data?.item?.name) {
      return { isPlaying: false, track: null }
    }

    const artist = (data.item.artists || []).map(a => a.name).filter(Boolean).join(', ')
    const albumArtUrl = data.item.album?.images?.[0]?.url || ''

    return {
      isPlaying: Boolean(data.is_playing),
      track: {
        song: data.item.name,
        artist,
        album_art_url: albumArtUrl,
        timestamp: data.timestamp || Date.now(),
        external_url: data.item.external_urls?.spotify || '',
      },
    }
  }
  catch {
    return { isPlaying: false, track: null }
  }
})
