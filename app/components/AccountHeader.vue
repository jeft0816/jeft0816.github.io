<script setup>
const { data: accounts } = await useFetch('/api/users')

const route = useRoute()
const isEntryPage = computed(() => route.path === '/')
</script>

<template>
  <header v-if="!isEntryPage && accounts" class="account-header">
    <div class="header-content">
      <NuxtLink
        v-for="acc in accounts"
        :key="acc.id"
        :to="acc.path"
        class="nav-button"
        active-class="active"
      >
        <div class="avatar-icon" :style="{ background: `url(${acc.avatar}) center/cover no-repeat` }" />
      </NuxtLink>
    </div>
  </header>
</template>

<style scoped>
.account-header {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1100;
  pointer-events: none;
}

.header-content {
  display: flex;
  gap: 20px;
  background: none;
  backdrop-filter: none;
  padding: 10px 20px;
  pointer-events: auto;
}

.nav-button {
  width: 55px;
  height: 55px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
  text-decoration: none;
  border: 2px solid transparent;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.05);
}

.nav-button:hover {
  transform: scale(1.1);
  border-color: rgba(255, 255, 255, 0.2);
}

.nav-button.active {
  border-color: #fff;
  transform: scale(1.1);
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.1);
}

.avatar-icon {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}
</style>
