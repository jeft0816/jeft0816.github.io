<template>
  <div class="layout-wrapper">
    <main class="main-content">
      <slot />
    </main>
    <AccountHeader />
  </div>
</template>

<style scoped>
.layout-wrapper {
  width: 100vw;
  height: 100vh;
  position: relative;
  background: #000;
  overflow: hidden;
}

.main-content {
  width: 100%;
  height: 100%;
}
</style>
