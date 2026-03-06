<script setup>
useHead({
  title: 'Profil',
  link: [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;700&display=swap' },
  ],
})

const profile = {
  names: ['Buvak', 'Jeft'],
  discordId: '828344938944921630',
  discordUsername: 'jeft._.',
  location: 'BURSA',
  avatarUrl: '/Toji.jpg',
  bgVideoUrl: '/Toji_Edit.mp4',
  instagramUrl: 'https://www.instagram.com/burak._.tmr8/',
  spotifyUrl: 'https://open.spotify.com/user/btsxr9443erco2g850ytb4jv4?si=ad579d1d308b4387',
}
</script>

<template>
  <ProfileCard v-bind="profile" />
</template>
