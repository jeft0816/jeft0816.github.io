<script setup lang="ts">
const mode = useColorMode()
const { state, next } = useCycleList(['dark', 'light'] as const, { initialValue: mode })
watchEffect(() => mode.value = state.value)
</script>

<template>
  <Button variant="link" :icon="state !== 'dark' ? 'pi pi-moon' : 'pi pi-sun'" @click="next()" />
</template>
