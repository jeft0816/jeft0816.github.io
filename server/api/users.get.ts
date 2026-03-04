const users: Record<string, {
  slug: string
  names: string[]
  discordId: string
  discordUsername: string
  location: string
  avatarUrl: string
  bgVideoUrl: string
  instagramUrl: string
  spotifyUrl: string
}> = {
  user1: {
    slug: 'buvak',
    names: ['Buvak', 'Jeft'],
    discordId: '828344938944921630',
    discordUsername: 'jeft._.',
    location: 'BURSA',
    avatarUrl: '/Toji.jpg',
    bgVideoUrl: '/Toji_Edit.mp4',
    instagramUrl: 'https://www.instagram.com/burak._.tmr8/',
    spotifyUrl: 'https://open.spotify.com/user/btsxr9443erco2g850ytb4jv4?si=ad579d1d308b4387',
  },
  user2: {
    slug: 'eren',
    names: ['Eren', 'AIZEN'],
    discordId: '234567890123456789',
    discordUsername: 'ryuujin_236',
    location: 'BURSA',
    avatarUrl: '/aizen.jpg',
    bgVideoUrl: '/Aizen_Edit.mp4',
    instagramUrl: 'https://www.instagram.com/kazu_ra236/',
    spotifyUrl: '',
  },
  user3: {
    slug: 'emir',
    names: ['Emir', 'JŌTARŌ'],
    discordId: '678598206736564229',
    discordUsername: 'emir__k.',
    location: 'BURSA',
    avatarUrl: '/jotaro.jpg',
    bgVideoUrl: '',
    instagramUrl: 'https://www.instagram.com/emir_ama_ruhsuz/',
    spotifyUrl: '',
  },
  user4: {
    slug: 'ahmet',
    names: ['Ahmet', 'SATORU'],
    discordId: '1037782253398409276',
    discordUsername: 'penguen_ve_penguen',
    location: 'BURSA',
    avatarUrl: '/Gojo.jpg',
    bgVideoUrl: '/Gojo_Edit.mp4',
    instagramUrl: 'https://www.instagram.com/ahmet._.and._.penguen/',
    spotifyUrl: '',
  },
}

export default defineEventHandler((event) => {
  const query = getQuery(event)
  const id = query.id as string
  const slug = query.slug as string

  if (id) {
    const user = users[id]
    if (!user) {
      throw createError({ statusCode: 404, statusMessage: 'Kullanıcı bulunamadı' })
    }
    return user
  }

  if (slug) {
    const user = Object.values(users).find(u => u.slug === slug)
    if (!user) {
      throw createError({ statusCode: 404, statusMessage: 'Kullanıcı bulunamadı' })
    }
    return user
  }

  // Return all users (summary for header)
  return Object.entries(users).map(([key, val]) => ({
    id: key,
    path: `/${val.slug}`,
    avatar: val.avatarUrl,
  }))
})
