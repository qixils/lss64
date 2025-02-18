<script setup lang="ts">
import { until, useNow, whenever } from '@vueuse/core';
import { onMounted, ref, useTemplateRef, watch } from 'vue';
import { addSeconds, isAfter, isBefore, subDays, subSeconds } from 'date-fns';
import { useRoyale } from '../composables/useRoyale';
import { LobbyRoyaleUser } from '../../types';
import '@types/twitch-browser'

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
const { showing } = useRoyale()

type StreamIndex = (typeof classIndex)[number]
type Stream = {
  index: StreamIndex,
  loadedAt: Date,
  user: LobbyRoyaleUser,
  twitch?: Twitch.Player,
  youtube?: YT.Player,
}

const activeStreams = ref<Stream[]>(classIndex.map(index => ({ index, loadedAt: new Date(3000, 12), channel: "", user: { ccUID: '', image: '', joinedAt: '', name: 'CrowdControl', originID: '', profile: 'twitch', score: 0 } })))

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
          <!-- todo: platform icon -->
          <p>{{ stream.user.name }}</p>
        </div>
      </div>
    </div>

    <div class="content flex flex-col">
      <div class="flex-1 m-[13px] pt-[832.25px] pr-[438.44px] flex flex-row justify-between items-stretch">
        <!-- Crowd Control Lobby Royale -->
        <div class="flex flex-col">
          <p>crowd control lobby royale man</p>
        </div>
        <!-- Commentators -->
        <div class="flex flex-col justify-evenly">
          <p>im commentating yo</p>
        </div>
      </div>
      <!-- bottom bar -->
      <div class="bottom-bar">
        <!-- left -->
        <div class="flex flex-row justify-start items-center gap-2">
          <svg class="star" width="37" height="35" viewBox="0 0 37 35" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16.2325 1.32181L12.3108 10.4487L2.5683 12.3945C0.821108 12.7421 0.229286 14.9496 1.57119 16.1258L9.03668 22.6749L7.86915 32.5402C7.65938 34.3233 9.59013 35.5496 11.1058 34.6413L19.6465 29.5646L28.6712 33.7208C30.2731 34.4589 32.0655 33.0443 31.6705 31.2928L29.4781 21.6036L36.2182 14.3101C37.4298 13 36.6104 10.8665 34.8365 10.7034L24.9439 9.78664L20.0897 1.11967C19.2204 -0.424988 16.9413 -0.325763 16.2325 1.32181Z" fill="white"/>
          </svg>
          <p class="font-extrabold text-[32px] text-[hsla(320,7%,98%,1)] leading-none">
            PLAYERS' OBJECTIVE:
            <!-- todo: nodecg game -->
            <span class="font-bold text-[hsla(240,26%,74%,1)] uppercase">COLLECT 30 STARS</span>
          </p>
        </div>
        <div class="flex flex-col justify-evenly items-end gap-0.5">
          <p class="text-base font-bold text-[hsla(240,26%,74%,1)] leading-none">LOBBY CODE</p>
          <p class="text-2xl font-extrabold text-[hsla(320,7%,98%,1)] leading-none uppercase">5MMF9E9C</p>
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
  font-family: 'Poppins', sans-serif;
}

.bottom-bar {
  @apply px-2 py-1 flex flex-row justify-between items-center h-[58px];
  background-color: hsla(250, 42%, 11%, 1);
  box-shadow: 0px 0px 13.9px 0px hsla(250, 78%, 4%, 0.65);
}

.video, .streamer {
  transition-property: inset, box-shadow, border, width, height, padding, font-size;
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
  gap: 0.125rem;
}
.first .streamer {
  font-size: 30px;
  padding: 0.8rem 1.6rem;
  border-width: 2px;
  --margin: 1rem;
}
.second .streamer, .third .streamer, .fourth .streamer, .fifth .streamer {
  font-size: 15px;
  padding: 0.5rem 1rem;
  border-width: 1px;
  --margin: 0.5rem;
}

.star {
  animation: 4s ease-in-out 0s infinite rotate;
}

@keyframes rotate {
  0%, 100% {
    transform: rotate(-10deg);
  }

  50% {
    transform: rotate(10deg);
  }
}
</style>
