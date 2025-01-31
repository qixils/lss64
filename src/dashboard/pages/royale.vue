<script setup lang="ts">
import { createReusableTemplate } from '@vueuse/core';
import { LobbyRoyaleUser } from '../../types';
import { useReplicants } from '../composables/useReplicants';
import { UnwrapRef } from 'vue';

const { players, showing, pending, ignored, sendUpdatePlayers } = useReplicants()

// https://stackoverflow.com/a/2450976
function shuffle<T>(array: T[]): T[] {
  let currentIndex = array.length;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {

    // Pick a remaining element...
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array
}

const isIgnored = (ccUID: UnwrapRef<typeof ignored>[number]['ccUID']) => {
  return !!ignored.value.find(player => player.ccUID === ccUID)
}

const showPlayers = (newPlayers: LobbyRoyaleUser[]) => {
  // backend will do most of the filtering like for scores but we need to handle ignored users
  const filtered = newPlayers.filter(user => !isIgnored(user.ccUID))
  pending.value = [...filtered].slice(5)
  showing.value = [...filtered].slice(0, 5)
}

const showTopPlayers = () => {
  showPlayers([...players.value].sort((a, b) => b.score - a.score))
}

const showRandomPlayers = () => {
  showPlayers(shuffle([...players.value]))
}

const focusPlayer = (ccUID: LobbyRoyaleUser['ccUID']) => {
  const currentPlayer = players.value.find(player => player.ccUID === ccUID)
  if (!currentPlayer) return

  const currentIndex = showing.value.findIndex(player => player.ccUID === ccUID)
  if (currentIndex === 0) return // ignore player #1

  const newShowing = [...showing.value]

  // Swap
  if (currentIndex !== 1) {
    newShowing[0] = currentPlayer
    newShowing[currentIndex] = showing.value[0]
  }
  // Push
  else {
    newShowing.unshift(currentPlayer)
    newShowing.pop()
  }

  showing.value = [...newShowing]
}

const hidePlayer = (user: UnwrapRef<typeof ignored>[number]) => {
  const { ccUID, name } = user
  user = { ccUID, name }

  if (isIgnored(user.ccUID)) return

  // If they're in the top 5 then let's swap them out
  const currentIndex = showing.value.findIndex(player => player.ccUID === user.ccUID)
  if (currentIndex !== -1) {
    const newShowing = [...showing.value]
    const replacement = pending.value.shift()
    if (replacement) newShowing[currentIndex] = replacement
    else console.log("Unable to find replacement for ignored user")
  }

  ignored.value = [...ignored.value, user]
}

const showPlayer = (ccUID: UnwrapRef<typeof ignored>[number]['ccUID']) => {
  ignored.value = ignored.value.filter(player => player.ccUID !== ccUID)
}

const [DefineTemplate, ReuseTemplate] = createReusableTemplate<
  {
    player: LobbyRoyaleUser,
    innerClass: string,
  }
>()
</script>

<template>
  <div class="p-1 flex flex-col gap-1 bg-stone-300 text-stone-950 items-stretch">
    <p class="text-xl font-bold">Player List</p>
    <p class="font-semibold italic text-stone-700">First, update the scores and active streams...</p>
    <div class="flex-1 p-2 flex justify-center items-center text-center bg-slate-600 text-slate-950 hover:scale-110" @click="sendUpdatePlayers()">
      <p>Refresh Players</p>
    </div>
    <p class="font-semibold italic text-stone-700">Then, push up some new runners...</p>
    <div class="flex-1 p-2 flex justify-center items-center text-center bg-slate-500 text-slate-950 hover:scale-110" @click="showTopPlayers()">
      <p>Show Top 5 Players</p>
    </div>
    <div class="flex-1 p-2 flex justify-center items-center text-center bg-slate-500 text-slate-950 hover:scale-110" @click="showRandomPlayers()">
      <p>Show Random 5 Players</p>
    </div>
    <p class="text-xl font-bold">Active Players</p>
    <p class="font-semibold italic text-stone-700">Click on a top 5 player to swap them into the primary, or a lower player to push them into the primary. Click the X to hide them from the stream.</p>
    <DefineTemplate v-slot="{ player, innerClass }">
      <div class="flex flex-row gap-1 justify-stretch items-stretch">
        <div class="flex-1 p-2 flex justify-center items-center text-center text-stone-50 hover:scale-110" :class="innerClass" @click="focusPlayer(player.ccUID)">
          <p>{{ player.name }}</p>
        </div>
        <div class="aspect-square flex flex-row items-center justify-center bg-red-500 text-red-950" @click="hidePlayer(player)">
          <svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="-64 0 512 512"><path fill="currentColor" d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7L86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256L41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3l105.4 105.3c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256z"/></svg>
        </div>
      </div>
    </DefineTemplate>
    <ReuseTemplate v-if="players[0]" :player="players[0]" inner-class="bg-stone-800" />
    <p v-else class="bg-red-400 text-red-950 italic">No Players Loaded</p>
    <hr>
    <ReuseTemplate v-for="player in players.slice(1, 5)" :player="player" inner-class="bg-stone-700" />
    <hr>
    <div class="flex flex-col gap-1 h-40 overflow-y-scroll items-stretch bg-stone-400 p-0.5">
      <ReuseTemplate v-for="player in players.slice(5)" :player="player" inner-class="bg-stone-600" />
    </div>
    <hr>
    <p class="text-xl font-bold">Ignored Players</p>
    <p class="font-semibold italic text-stone-700">Click on a player to allow them to appear on the stream again. Note they cannot appear until the list is next updated.</p>
    <div v-for="player in ignored" class="flex-1 p-2 flex justify-center items-center text-center bg-red-500 text-red-950 hover:scale-110" @click="showPlayer(player.ccUID)">
      <p>{{ player.name }}</p>
    </div>
  </div>
</template>
