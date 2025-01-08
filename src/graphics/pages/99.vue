<script setup lang="ts">
  import Timer from '../components/Timer.vue';
</script>

<template>
  <!-- root container-->
  <div class="grid grid-rows-[auto_1fr_1fr]">
    <!-- apex/lexi feeds -->
    <div class="flex flex-row">
      <!-- apex feed -->
      <div>
        <div class="aspect-square w-[calc((1-(1.2/1))*100%)] bg-gray-700"></div>
        <div class="flex flex-row items-center justify-center p-2 text-lg bg-orange-400 text-black-100 rounded-b">
          <!-- TODO: show time? -->
          <p>NotQuiteApex</p>
        </div>
      </div>
      <!-- lexi feed -->
      <div class="aspect-square w-[calc((1.2/1)*100%)] bg-gray-800"></div>
    </div>
    <!-- timers container -->
    <div class="flex flex-row items-stretch justify-end">
      <!-- subs? -->
      <div class="flex-1 flex flex-row items-center justify-center">
        <p v-if="false"><span>69.2</span> subs</p>
      </div>
      <!-- timers -->
      <div class="grid grid-cols-[1fr_1fr_1fr_1fr] basis-[calc((1-(1.2/1))*100%)] flex-shrink-0">
        <!-- TODO: Source Sans 3? -->
        <p class="bg-orange-400 text-black-100">my time</p>
        <Timer :scale="0.9" :player="0" :inline="true" />
        <p class="bg-orange-400 text-black-100">time to beat</p>
        <!-- TODO: this probably won't be a timer, unless we can arbitrarily set its stopped time value? and animate it? -->
        <Timer :scale="0.9" :player="2" :inline="true" />
      </div>
    </div>
    <!-- data container -->
    <div class="flex flex-row">
      <!-- data type -->
      <!-- TODO: funny shape (smuggle shape into work figma and copy? no i dont have access grr) -->
      <div class="basis-30 flex flex-col gap-1 items-center justify-center">
        <p>info</p>
        <div class="flex flex-row gap-1 items-center justify-center">
          <!-- TODO: glow, colors-->
          <div class="h-1 w-3 rounded-full"></div>
          <div class="h-1 w-3 rounded-full"></div>
          <div class="h-1 w-3 rounded-full"></div>
          <div class="h-1 w-3 rounded-full"></div>
          <div class="h-1 w-3 rounded-full"></div>
        </div>
      </div>
      <!-- data value (TODO: merge Transition with parent) -->
      <div class="flex-1 flex flex-row items-center justify-center">
        <Transition>
          <!-- info -->
          <p>you are watching the <span class="text-orange-300">99.9%</span> subathon</p>
          <p v-if="false">the stream ends when we beat 99.9% of runners</p>
          <!-- game -->
          <p v-if="false">{game}</p>
          <!-- supporters -->
          <p v-if="false">the stream has been running for <span>69</span> hours thanks to <span>69</span> subs</p>
          <div v-if="false" class="flex-1 h-full flex flex-row items-stretch justify-start">
            <div class="odd:bg-orange-600 even:bg-orange-700">
              <!-- TODO -->
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>

<style lang="css" scoped></style>
