<script setup lang="ts">
  import { computed, onMounted, ref } from 'vue';
  import Timer from '../components/Timer.vue';
  import { useRun } from '../composables/run';
  import { useTimer } from '../composables/timer';
  import { useSubathon } from '../composables/subathon';

  const { activeRun } = useRun()
  const { timer } = useTimer()
  const { subathon, subathonGoal, subathonPercentile, subathonPercentileStr, subathonSupporters } = useSubathon()

  const timerState = computed(() => timer.value?.state)

  const footerBars = [
    {
      id: 'info',
      hue: 0,
      pages: 2,
    },
    {
      id: 'game',
      hue: 120,
      pages: 1,
    },
    {
      id: 'supporters',
      hue: 240,
      pages: 2,
    },
  ] as const
  const footerBarPages = footerBars.flatMap(bar => new Array(bar.pages).fill(bar.id) as (typeof footerBars)[number]['id'][])
  const footerIndex = ref(0)
  const footerBarType = computed(() => footerBarPages[footerIndex.value])

  onMounted(() => {
    setInterval(() => {
      let idx = footerIndex.value + 1
      if (idx >= footerBarPages.length) idx = 0
      footerIndex.value = idx
    }, 10_000)
  })
</script>

<template>
  <!-- root container-->
  <div class="grid grid-rows-[auto_1fr_1fr] h-[1080px] bg-pumpkin-100 text-stone-950">
    <!-- apex/lexi feeds -->
    <div class="flex flex-row">
      <!-- apex feed -->
      <div>
        <div class="aspect-video w-[320px] bg-stone-700"></div>
        <div class="flex flex-row items-center justify-center py-4 bg-pumpkin-400 rounded-b-2xl">
          <!-- TODO: show time? transition? -->
          <p class="text-4xl font-bold">NotQuiteApex</p>
        </div>
      </div>
      <!-- lexi feed -->
      <div class="aspect-video w-[1600px] bg-stone-800"></div>
    </div>
    <!-- timers container -->
    <div class="flex flex-row items-stretch justify-end">
      <!-- subs? -->
      <div class="flex-1 flex flex-row items-center justify-center">
        <p v-if="false"><span>69.2</span> subs</p>
      </div>
      <!-- timers -->
      <div class="grid grid-cols-[1fr_1fr_1fr_1fr] basis-[1600px] items-stretch flex-shrink-0">
        <!-- TODO: Source Sans 3? -->
        <div class="flex justify-center items-center bg-pumpkin-200 text-black-100 text-5xl font-bold">my time</div>
        <Timer :scale="0.9" :player="0" always-active />
        <div class="flex justify-center items-center bg-pumpkin-200 text-black-100 text-5xl font-bold">time to beat</div>
        <Timer :scale="0.9" :custom-time="subathonGoal" always-active />
      </div>
    </div>
    <!-- data container -->
    <div class="flex flex-row">
      <!-- data type -->
      <div class="basis-72 flex flex-col gap-2 items-center justify-center lss-edged z-50 bg-pumpkin-700">
        <div class="lss-relative-container w-72 h-12">
          <Transition name="swap">
            <p :key="footerBarType" class="font-bold text-5xl leading-none text-white text-center w-72">{{ footerBarType }}</p>
          </Transition>
        </div>
        <div class="flex flex-row gap-2 items-center justify-center">
          <div
            v-for="bar in footerBars"
            :key="bar.id"
            class="h-2 w-7 rounded-full bg-[var(--bar-color)] duration-500 transition-all"
            :class="{ 'shadow-[0_0_0.25rem_var(--bar-color)]': bar.id === footerBarType }"
            :style="`--bar-color: hsl(${bar.hue} ${bar.id === footerBarType ? '90% 60%' : '40% 30%'});`"
          ></div>
        </div>
      </div>
      <!-- data value -->
      <div class="lss-relative-container flex-1 flex flex-row items-center justify-center bg-pumpkin-300 text-5xl">
        <Transition name="swap">
          <!-- info -->
          <p v-if="footerIndex === 0">you are watching the <span class="lss-emphasis">{{ subathonPercentileStr }}</span> subathon</p>
          <p v-else-if="footerIndex === 1">the stream ends when we become top <span class="lss-emphasis">{{ subathonPercentileStr }}</span> speedrunners</p>
          <!-- game -->
          <p v-else-if="footerIndex === 2">{{ activeRun?.game || "Unknown Game" }}</p>
          <!-- supporters -->
          <p v-else-if="footerIndex === 3">the stream has been running for <span class="lss-emphasis">69</span> hours thanks to <span class="lss-emphasis">69</span> subs</p>
          <TransitionGroup name="supporters" tag="div" v-else-if="footerIndex === 4" class="flex-1 size-full flex flex-row-reverse items-stretch justify-end overflow-hidden">
            <div
              v-for="supporter in subathonSupporters.toReversed()"
              :key="supporter.index"
              class="flex flex-col gap-2 justify-center lss-edged pl-4 pr-5 flex-shrink-0"
              :class="[supporter.index % 2 === 0 ? 'bg-pumpkin-300' : 'bg-pumpkin-200']"
            >
              <p class="leading-none font-bold text-3xl">{{ supporter.user }}</p>
              <p class="leading-none font-semibold text-2xl text-stone-900">
                <template v-if="supporter.action === 'sub'">
                  Tier {{ supporter.amount }} Sub
                </template>
                <template v-else-if="supporter.action === 'gift-sub'">
                  {{ supporter.amount }}x Gifted Sub
                </template>
                <template v-else-if="supporter.action === 'bits'">
                  {{ supporter.amount }} Bits
                </template>
              </p>
            </div>
          </TransitionGroup>
        </Transition>
      </div>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.lss-edged {
  --lss-offset: -0.75rem;
  clip-path: polygon(0 0, 100% 0, calc(100% + var(--lss-offset)) 100%, 0 100%);
  margin-right: var(--lss-offset);
}

.lss-relative-container {
  position: relative;
}

.lss-relative-container > * {
  position: absolute;
}

.lss-emphasis {
  @apply text-pumpkin-600 font-semibold;
}

/* bar type */
.swap-enter-active,
.swap-leave-active {
  transition: all 0.5s ease;
}

.swap-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.swap-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

/* supporters */
.supporters-move, /* apply transition to moving elements */
.supporters-enter-active {
  transition: opacity 0.4s ease, transform 0.4s ease;
}

.supporters-enter-from {
  opacity: 0;
  transform: translateX(-60px);
}

/* ensure leaving items are taken out of layout flow so that moving
   animations can be calculated correctly. */
.supporters-leave-active {
  position: absolute;
  opacity: 0;
  transition: opacity 0;
}
</style>
