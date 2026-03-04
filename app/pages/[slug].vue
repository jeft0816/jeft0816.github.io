<script setup>
const route = useRoute()
const slug = computed(() => String(route.params.slug || ''))

const { data: userData } = await useFetch('/api/users', {
  query: { slug },
})
</script>

<template>
  <ProfileCard
    v-if="userData"
    :names="userData.names"
    :discord-id="userData.discordId"
    :discord-username="userData.discordUsername"
    :location="userData.location"
    :avatar-url="userData.avatarUrl"
    :bg-video-url="userData.bgVideoUrl"
    :instagram-url="userData.instagramUrl"
    :spotify-url="userData.spotifyUrl"
  />
</template>
