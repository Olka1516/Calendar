<template>
  <div class="color-wrapper">
    <div
      class="color-selected"
      :style="`background-color: ${selectedColor}`"
      @click="isOpen = true"
    />
    <div v-if="isOpen" class="color-content">
      <div
        v-for="item in colorsList"
        v-bind:key="item.lightColors.main"
        class="color-item"
        :style="`background-color: ${item.lightColors.main}`"
        @click="changeColor(item.lightColors.main, item.colorName)"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { colorsList } from '@/views/data'
import { ref } from 'vue'

const isOpen = ref(false)
const selectedColor = ref(colorsList.personal.lightColors.main)
const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', val: string): void
}>()

const handleInput = (colorName: string) => {
  emit('update:modelValue', colorName)
}

const changeColor = (color: string, colorName: string) => {
  selectedColor.value = color
  isOpen.value = false
  handleInput(colorName)
}
</script>
<style scoped lang="scss">
@use '@/assets/styles/index';
@include index.input-color;
</style>
