<script setup lang="ts">
import { profileData } from '~/constants/profile'

useHead({
  title: 'Profil',
  link: [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;700&display=swap' },
  ],
})
</script>

<template>
  <ProfileCard v-bind="profileData" />
</template>
