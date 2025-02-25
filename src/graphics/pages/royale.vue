<script setup lang="ts">
import { until, useNow, whenever } from '@vueuse/core';
import { onMounted, ref, useTemplateRef, watch } from 'vue';
import { addSeconds, isAfter, isBefore, subDays, subSeconds } from 'date-fns';
import { useRoyale } from '../composables/useRoyale';
import { LobbyRoyaleUser } from '../../types';
import { useRun } from '../composables/run';
import { useVoice } from '../composables/voice';

// https://developers.google.com/youtube/iframe_api_reference
declare namespace YT {
  interface PlayerOptions {
    width: string
    height: string
    videoId: string
    playerVars?: {
      // https://developers.google.com/youtube/player_parameters
      autoplay?: 0 | 1
      controls?: 0 | 1
    }
    events?: {
      onReady?: (event: Event & { target: YT.Player }) => void
      onError?: (event: { data: 2 | 5 | 100 | 101 | 150 }) => void
    }
  }
  interface TimedOptions {
    startSeconds?: number
    endSeconds?: number
  }
  interface ByIdOptions extends TimedOptions {
    videoId: string
  }
  interface ByUrlOptions extends TimedOptions {
    mediaContentUrl: string
  }
  class Player {
    constructor(element: HTMLElement | string, options: PlayerOptions)
    /**
     * Prepares a video by its ID without playing it.
     */
    cueVideoById(options: ByIdOptions): void
    cueVideoById(videoId: string, startSeconds?: number): void
    /**
     * Prepares and plays a video by its ID.
     */
    loadVideoById(options: ByIdOptions): void
    loadVideoById(videoId: string, startSeconds?: number): void
    /**
     * Prepares a video by its URL without playing it.
     */
    cueVideoByUrl(options: ByUrlOptions): void
    cueVideoByUrl(mediaContentUrl: string, startSeconds?: number): void
    /**
     * Prepares and plays a video by its URL.
     */
    loadVideoByUrl(options: ByUrlOptions): void
    loadVideoByUrl(mediaContentUrl: string, startSeconds?: number): void

    playVideo(): void
    pauseVideo(): void
    stopVideo(): void
    seekTo(seconds: number, allowSeekAhead: boolean): void
    mute(): void
    unMute(): void
    isMuted(): boolean
    setVolume(volume: number): void
    getVolume(volume: number): void
    setSize(width: number, height: number): object
    getPlaybackRate(): number
    setPlaybackRate(suggestedRate: number): void
    getAvailablePlaybackRates(): number[]
    /**
     * Removes the `<iframe>` containing the player.
     */
    destroy(): void
  }
}

const classIndex = ["first", "second", "third", "fourth", "fifth"] as const
const videos = useTemplateRef('videos')
const star = useTemplateRef('star')
const { showing } = useRoyale()
const { activeRun } = useRun()
const { commentators } = useVoice()

type StreamIndex = (typeof classIndex)[number]
type Stream = {
  index: StreamIndex,
  loadedAt: Date,
  user: LobbyRoyaleUser,
  twitch?: Twitch.Player,
  youtube?: YT.Player,
}

const activeStreams = ref<Stream[]>(classIndex.map(index => ({ index, loadedAt: new Date(3000, 12), channel: "", user: { ccUID: '', image: '', joinedAt: '', name: 'CrowdControl', originID: '', profile: 'twitch', score: 0, channel: 'CrowdControl' } })))

onMounted(async () => {
  const vidArr = await until(videos).toMatch(v => !!v && v.length >= 5) ?? [] // please typescript
  classIndex.forEach((clazz, index) => vidArr[index].classList.add(clazz, "video"))

  watch(showing, (newValue, oldValue) => {
    const newStreams: Stream[] = newValue.map((user, index) => {
      const prevStream = activeStreams.value.find(stream => user.ccUID === stream.user.ccUID)
      const loadedAt = prevStream?.loadedAt ?? new Date(Date.now())
      return {
        user,
        index: classIndex[index],
        loadedAt,
      } as Stream
    })

    // match channels with existing slots
    const sortedStreams: (Stream | undefined)[] = classIndex.map(index => undefined)
    for (const newStream of newStreams) {
      const oldIndex = activeStreams.value.findIndex(oldStream => newStream.user.ccUID === oldStream.user.ccUID)
      if (oldIndex !== -1) sortedStreams[oldIndex] = newStream
    }

    // fill holes
    for (const newStream of newStreams) {
      const oldIndex = activeStreams.value.findIndex(oldStream => newStream.user.ccUID === oldStream.user.ccUID)
      if (oldIndex !== -1) continue
      // try to find an empty hole that has the same streamIndex as previously to avoid swapping, else any hole will do
      let newIndex = sortedStreams.findIndex((value, index) => value === undefined && activeStreams.value[index].index === newStream.index)
      if (newIndex === -1) newIndex = sortedStreams.findIndex(value => value === undefined)
      sortedStreams[newIndex] = newStream
    }

    const finalStreams = sortedStreams as Stream[]

    // perform class swaps & iframe updates
    for (let i = 0; i < classIndex.length; i++) {
      const oldv = activeStreams.value[i]
      const newv = finalStreams[i]

      if (oldv.index !== newv.index) {
        vidArr[i].classList.add(newv.index)
        vidArr[i].classList.remove(oldv.index)
      }

      if (newv.user.profile !== 'youtube' && oldv.youtube) {
        oldv.youtube.destroy()
        oldv.youtube = undefined
      }

      if (newv.user.profile === 'twitch') {
        let twitch: Twitch.Player

        if (oldv.twitch) {
          twitch = oldv.twitch
          if (newv.user.channel !== oldv.user.channel) {
            twitch.setChannel(newv.user.channel)
          }
        } else {
          twitch = new Twitch.Player(`embed-${i}`, {
            height: "100%",
            width: "100%",
            parent: ["localhost"],
            channel: newv.user.channel,
            autoplay: true,
          })
        }

        twitch.setMuted(newv.index !== 'first')

        newv.twitch = twitch
        newv.youtube = undefined
      } else if (newv.user.profile === 'youtube') {
        let youtube: YT.Player

        if (oldv.youtube) {
          youtube = oldv.youtube
          if (newv.user.channel !== oldv.user.channel) {
            youtube.loadVideoById(newv.user.channel)
          }
        } else {
          youtube = new YT.Player(`embed-${i}`, {
            height: "100%",
            width: "100%",
            playerVars: {
              autoplay: 1,
              controls: 0,
            },
            videoId: newv.user.channel,
          })
        }

        if (newv.index === 'first') youtube.unMute()
        else youtube.mute()

        newv.twitch = undefined
        newv.youtube = youtube
      } else {
        newv.twitch = undefined
        newv.youtube = undefined
        const container = vidArr[i].querySelector(".embed-container")
        if (container) container.innerHTML = '' // TODO i don't think this is really right
      }
    }

    // finish
    activeStreams.value = [...finalStreams]
  })

  const starEl = await until(star).toBeTruthy()
  let on = false;
  setInterval(function () {
    starEl.setAttribute('data-animation', (on) ? 'on' : '');
    on = !on;
  }, 2500);
})

const now = useNow({ interval: 100 })
</script>

<template>
  <div class="royale">
    <div class="videos absolute">
      <div v-for="(stream, index) in activeStreams" ref="videos">
        <div class="embed-container" :id="`embed-${index}`"></div>
        <div class="obscure inset-0 bg-[hsla(250,42%,11%,1)] transition-opacity duration-500" :style="`opacity: ${isAfter(now, addSeconds(stream.loadedAt, 5)) ? '100' : '0'}%`"></div>
        <div class="streamer">
          <svg v-if="stream.user.profile === 'twitch'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M391.17 103.47h-38.63v109.7h38.63ZM285 103h-38.63v109.75H285ZM120.83 0L24.31 91.42v329.16h115.83V512l96.53-91.42h77.25L487.69 256V0Zm328.24 237.75l-77.22 73.12h-77.24l-67.6 64v-64h-86.87V36.58h308.93Z"/></svg>
          <svg v-else-if="stream.user.profile === 'youtube'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path fill="currentColor" d="M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597c-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821c11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305m-317.51 213.508V175.185l142.739 81.205z"/></svg>
          <p>{{ stream.user.name }}</p>
        </div>
      </div>
    </div>

    <div class="content flex flex-col">
      <div class="flex-1 m-[13px] pt-[832.25px] pr-[438.44px] flex flex-row justify-between">
        <!-- Crowd Control Lobby Royale -->
        <div class="self-center h-32 flex flex-row items-stretch gap-4">
          <img src="~/public/CrowdControlLogo.svg" class="h-full w-auto aspect-square" />
          <div class="flex flex-col gap-1 justify-center items-start">
            <img src="~/public/CrowdControlText.svg" class="ml-[0.4rem] h-6 object-left object-contain drop-shadow-[0_0_0.1rem_#cdcde9]" />
            <img src="~/public/LobbyRoyaleText.webp" class="h-[4.7rem] object-left object-contain" />
            <!-- <p class="cc-royale-text">
              <span class="-mr-0.5">L</span><span>O</span><span>B</span><span>B</span><span class="-ml-0.5 mr-4">Y</span>
              <span>R</span><span>O</span><span class="-ml-1 -mr-2">Y</span><span>A</span><span>L</span><span>E</span>
            </p> -->
          </div>
        </div>
        <!-- Commentators -->
        <div class="self-stretch flex flex-col justify-evenly items-end">
          <div v-for="commentator in commentators" :id="commentator.id" class="flex flex-row items-stretch h-11 w-max">
            <div
              class="rounded-l-full bg-[hsla(239,25%,17%,1)] h-full w-auto aspect-square"
            >
              <img
                :src="commentator.discord?.pfp || 'Ghost.png'"
                class="rounded-full bg-[#2d304c] h-full w-auto aspect-square outline outline-2 -outline-offset-2"
                :class="[commentator.discord?.speaking ? 'outline-[hsla(54,100%,62%,1)]' : 'outline-transparent']"
              />
            </div>
            <div class="rounded-r-2xl bg-[hsla(239,25%,17%,1)] flex flex-row gap-2 px-2 items-center w-max">
              <p class="font-bold text-2xl leading-none text-[hsla(320,7%,98%,1)]">{{ commentator.name }}</p>
              <p v-if="commentator.pronouns" class="font-medium text-xl leading-none text-[hsla(240,39%,86%,1)] lowercase">{{ commentator.pronouns.replace(/\s*\/\s*/, ' • ') }}</p>
            </div>
          </div>
        </div>
      </div>
      <!-- bottom bar -->
      <div class="bottom-bar">
        <!-- left -->
        <div class="flex flex-row justify-start items-center gap-2">
          <!--
          <svg class="star" width="37" height="35" viewBox="0 0 37 35" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16.2325 1.32181L12.3108 10.4487L2.5683 12.3945C0.821108 12.7421 0.229286 14.9496 1.57119 16.1258L9.03668 22.6749L7.86915 32.5402C7.65938 34.3233 9.59013 35.5496 11.1058 34.6413L19.6465 29.5646L28.6712 33.7208C30.2731 34.4589 32.0655 33.0443 31.6705 31.2928L29.4781 21.6036L36.2182 14.3101C37.4298 13 36.6104 10.8665 34.8365 10.7034L24.9439 9.78664L20.0897 1.11967C19.2204 -0.424988 16.9413 -0.325763 16.2325 1.32181Z" fill="white"/>
          </svg>
          -->
          <div class="star" ref="star"></div>
          <p class="font-extrabold text-[32px] text-[hsla(320,7%,98%,1)] leading-none">
            PLAYERS' OBJECTIVE:
            <span class="font-bold text-[hsla(240,26%,74%,1)] uppercase">{{ activeRun?.category || "N/A" }}</span>
          </p>
        </div>
        <div class="flex flex-col justify-evenly items-end gap-0.5">
          <p class="text-base font-bold text-[hsla(240,26%,74%,1)] leading-none">LOBBY CODE</p>
          <p class="cc-lobby-code">5MMF9E9C</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');

.royale, .content {
  width: 1920px;
  height: 1080px;
}

.royale {
  background-image: url("~/public/royale.png");
  background-size: cover;
  background-position: center;
  font-family: 'Poppins', sans-serif;
}

.bottom-bar {
  @apply px-2 py-1 flex flex-row justify-between items-center h-[58px];
  background-color: hsla(250, 42%, 11%, 1);
  box-shadow: 0px 0px 13.9px 0px hsla(250, 78%, 4%, 0.65);
}

.video, .streamer {
  transition-property: inset, box-shadow, border, width, height, padding, font-size, gap;
  transition-duration: 0.5s;
  transition-timing-function: cubic-bezier(.77,0,.18,1);
}

.video, .embed-container, .obscure, iframe {
  border-radius: 10px;
}

.video, .obscure {
  position: absolute;
  background-color: hsla(250, 42%, 11%, 1);
}

.video {
  box-shadow: 0px 0px var(--glow-size, 8.1px) 0px var(--video-color, hsla(320, 7%, 98%, 1));
  border: 2px solid var(--video-color);
}
.first {
  --video-color: hsla(320, 7%, 98%, 1);
  --glow-size: 8.1px;
  z-index: 5;
  top: 13px;
  left: 13px;
  width: 1456.44px;
  height: 819.25px;
}
.second, .third, .fourth, .fifth {
  --glow-size: 7.1px;
  --height: 239.31px;
  --gap: 13px;
  left: 1482px;
  width: 425.44px;
  height: var(--height);
  top: calc(13px + ((var(--height) + var(--gap)) * var(--index, 0)));
}
.second {
  --video-color: hsla(54, 91%, 77%, 1);
  z-index: 4;
  --index: 0;
}
.third {
  --video-color: hsla(346, 78%, 43%, 1);
  z-index: 3;
  --index: 1;
}
.fourth {
  --video-color: hsla(169, 77%, 50%, 1);
  z-index: 2;
  --index: 2;
}
.fifth {
  --video-color: hsla(227, 86%, 77%, 1);
  z-index: 1;
  --index: 3;
}

.embed-container {
  position: absolute;
  inset: 0;
}

.streamer {
  position: absolute;
  line-height: 1;
  border-radius: 39.29px 17.29px 47.15px 39.29px;
  border-color: var(--video-color, hsla(320, 7%, 98%, 1));
  background: linear-gradient(180deg, #1A172A 0%, #151129 100%);
  color: hsla(320, 7%, 98%, 1);
  font-weight: 700;
  text-align: center;
  min-width: 50px;
  top: var(--margin);
  right: var(--margin);
  display: flex;
  flex-direction: row;
  align-items: center;
  font-size: var(--text-size);
}
.first .streamer {
  --text-size: 30px;
  padding: 0.8rem 1.6rem;
  border-width: 2px;
  --margin: 1rem;
  gap: 0.4rem;
}
.second .streamer, .third .streamer, .fourth .streamer, .fifth .streamer {
  --text-size: 15px;
  padding: 0.5rem 1rem;
  border-width: 1px;
  --margin: 0.5rem;
  gap: 0.2rem;
}
.streamer svg {
  width: calc(var(--text-size) * (4/5));
  aspect-ratio: 1 / 1;
}

.star {
  animation: 4s ease-in-out 0s infinite rotate;
  width: 37px;
  height: 35px;
  clip-path: path("M16.2325 1.32181L12.3108 10.4487L2.5683 12.3945C0.821108 12.7421 0.229286 14.9496 1.57119 16.1258L9.03668 22.6749L7.86915 32.5402C7.65938 34.3233 9.59013 35.5496 11.1058 34.6413L19.6465 29.5646L28.6712 33.7208C30.2731 34.4589 32.0655 33.0443 31.6705 31.2928L29.4781 21.6036L36.2182 14.3101C37.4298 13 36.6104 10.8665 34.8365 10.7034L24.9439 9.78664L20.0897 1.11967C19.2204 -0.424988 16.9413 -0.325763 16.2325 1.32181Z");
  background-color: white;
  scale: 80%;
  /*
  background: linear-gradient(-65deg, #FFF 43%, #FF5 50%, #FFF 57%);
  background-size: 250% auto;
  background-position: 300% center;
  */
}
/*
.star[data-animation="on"] {
  animation: 4s ease-in-out 0s infinite rotate, 0.75s ease-in 0s 1 shine;
}
*/

.cc-lobby-code {
  @apply text-2xl font-extrabold text-[hsla(320,7%,98%,1)] leading-none uppercase;
  letter-spacing: 0.25rem;
}

.cc-royale-text {
  @apply text-[4.7rem] leading-none font-[950] uppercase -mt-2 -mb-3;
  /* letter-spacing: 0.1rem; */
  font-kerning: auto;
}
.cc-royale-text span {
  -webkit-text-fill-color: transparent;
  -webkit-text-stroke-width: 1px;
  -webkit-text-stroke-color: var(--span-color);
  filter: drop-shadow(0 0 0.3rem var(--span-color));
}
.cc-royale-text span:nth-child(4n+1) {
  --span-color: hsla(54, 100%, 62%, 1);
}
.cc-royale-text span:nth-child(4n+2) {
  --span-color: hsla(351, 92%, 62%, 1);
}
.cc-royale-text span:nth-child(4n+3) {
  --span-color: hsla(169, 77%, 50%, 1);
}
.cc-royale-text span:nth-child(4n) {
  --span-color: hsla(240, 100%, 70%, 1);
}

@keyframes rotate {
  0%, 100% {
    transform: rotate(-10deg);
  }

  50% {
    transform: rotate(10deg);
  }
}

@keyframes shine {
  from {
    background-position: 100% center;
  }
  to {
    background-position: -52% center;
  }
}
</style>
