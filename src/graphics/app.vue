<script setup lang="ts">
  import { onMounted } from 'vue';
  import "core-js/actual";

  const fixUrl = () => {
    const url = window.location.href
    if (url.endsWith(".html")) return
    window.history.pushState(url, "", `${url}.html`);
  }

  onMounted(() => {
    setTimeout(fixUrl, 50)
    setTimeout(fixUrl, 100)
    setTimeout(fixUrl, 200)
    setTimeout(fixUrl, 500)
    setTimeout(fixUrl, 1000)
  })
</script>

<template>
  <div class="root">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<style lang="postcss">
@tailwind components;
@tailwind utilities;

body {
	font-family: 'Lato', sans-serif;
  background-color: transparent;
  margin: 0;
  overflow: hidden;
  width: 1920px;
  height: 1080px;
}
</style>
