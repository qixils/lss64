<script setup lang="ts">
import { computed } from 'vue';
import type { RunDataCommentator } from 'nodecg-speedcontrol/src/types';
import PlayerName from '../components/PlayerName.vue';
import { useRun } from '../composables/run';
import { useVoice } from '../composables/voice';
import { UserVoiceStatus } from '../../types';

const { activeRun } = useRun()
const { commentators } = useVoice()
</script>

<template>
  <TransitionGroup class="commentator-container" name="commentator-container" tag="div">
    <div class="commentator" v-for="commentator in commentators" :key="commentator.id">
      <img
        :src="commentator.discord?.pfp ?? 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@latest/assets/72x72/1f399.png'"
        :class="{ active: commentator.discord?.speaking, pfp: commentator.discord?.pfp }">
      <PlayerName :scale="0.85" :player="commentator" />
    </div>
  </TransitionGroup>
</template>

<style>
html,
body,
#__nuxt,
body,
.root,
.commentator-container {
  width: 100vw;
  height: 100vh;
}

.commentator-container {
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  margin-left: 0.5rem;
}

.commentator {
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  align-items: center;
  height: 3.5rem;
  /* hack fix */
}

.commentator-container-move,
/* apply transition to moving elements */
.commentator-container-enter-active,
.commentator-container-leave-active {
  transition: all 0.5s ease;
}

.commentator-container-enter-from,
.commentator-container-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

/* ensure leaving items are taken out of layout flow so that moving
   animations can be calculated correctly. */
.commentator-container-leave-active {
  position: absolute;
}

p {
  font-size: 3rem;
  padding: 0;
  margin: 0;
  color: white;
  text-shadow: 0 0 4px black;
}
</style>

<style scoped>
img,
svg {
  aspect-ratio: 1 / 1;
  width: 2.5rem;
  padding: 0.1rem;
  border: 0.25rem solid transparent;
}

.active {
  border-color: #23a559;
}

.pfp {
  border-radius: 100%;
}
</style>
