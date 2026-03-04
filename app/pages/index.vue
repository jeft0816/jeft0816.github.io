<script setup>
// SEO and Meta Tags
useHead({
  title: 'Hoş Geldiniz',
  link: [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;700&display=swap' },
  ],
})

const { data: accounts } = await useFetch('/api/users')

function enterSite() {
  navigateTo(accounts.value?.[0]?.path || '/')
}
</script>

<template>
  <div class="app-container">
    <div
      id="entry-screen"
      @click="enterSite"
    >
      <div class="hello-wrapper">
        <span class="hello-text">merhaba</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.app-container {
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background: #000;
}

#entry-screen {
  position: fixed;
  inset: 0;
  background: #000;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  cursor: pointer;
}

.hello-text {
  font-size: 1.1rem;
  letter-spacing: 5px;
  opacity: 0.5;
  animation: pulse 2s infinite ease-in-out;
  color: #fff;
  text-transform: lowercase;
}

@keyframes pulse {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.8; }
}
</style>
