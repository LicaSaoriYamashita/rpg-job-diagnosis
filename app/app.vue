<script setup lang="ts">
useHead({
  link: [
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/icon?family=Material+Icons' },
  ],
})
</script>

<template>
  <NuxtPage />
  <div class="vignette" />
</template>

<style>
.vignette {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: -1;
  background: radial-gradient(
    ellipse at center,
    transparent 60%,
    rgba(0, 0, 0, 0.25) 100%
  );
}
</style>
