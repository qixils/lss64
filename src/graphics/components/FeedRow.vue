<script setup lang="ts">
import Timer from './Timer.vue';
import Player from './Player.vue';

const props = defineProps<{
  scale: number,
  firstPlayer: number,
  timer: boolean,
  ar: number,
}>()
</script>

<template>
  <div class="feeds">
    <div class="feed">
      <Timer :scale="scale" :player="firstPlayer + 0" :inline="true" alignment="left" />
    </div>
    <div class="feed">
      <Timer :scale="scale" :player="firstPlayer + 1" :inline="true" alignment="right" />
    </div>
  </div>
  <div class="bar">
    <Player :scale="scale" class="player" :player="firstPlayer" />
    <Timer :scale="scale" v-if="timer" />
    <div v-else></div>
    <Player :scale="scale" class="player" :player="firstPlayer + 1" alignment="right" />
  </div>
</template>

<style scoped>
.feeds {
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-around;
}

.feed {
  display: block;
  aspect-ratio: v-bind(ar);
  width: 50%;
}

.bar {
  display: grid;
  grid-template-columns: auto 1fr auto 1fr auto;
  height: calc(4.5rem * v-bind(scale));
}
</style>
