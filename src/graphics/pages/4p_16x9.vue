<script setup lang="ts">
import Round from '../components/Round.vue';
import FeedRow from '../components/FeedRow.vue';
import Timer from '../components/Timer.vue';

const infoScale = 1.0
const feedScale = 0.75
</script>

<template>
  <div class="body">
    <Round :scale="infoScale" class="round" />
    <FeedRow class="feed" :ar="16 / 9" :scale="feedScale" :first-player="0" :timer="false" />
    <FeedRow class="feed" :ar="16 / 9" :scale="feedScale" :first-player="2" :timer="false" />
    <Timer :scale="infoScale" :dynamic-width="true" />
  </div>
</template>

<style scoped>
.body {
  width: calc(1920px - 26rem);
  font-size: calc(3.5rem * v-bind(feedScale));
  color: white;
}
</style>
