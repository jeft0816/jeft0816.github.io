<script setup>
const { data: userData } = await useFetch('/api/users', { query: { id: 'user2' } })
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
