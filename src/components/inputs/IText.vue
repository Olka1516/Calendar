<template>
  <input
    required
    v-model="userInfo"
    @input="handleInput($event)"
    :class="{ 'time-text': name === 'notes' }"
  />
  <i>{{ props.name }}</i>
</template>
<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  modelValue: string
  name: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', val: string): void
}>()

const userInfo = ref(props.modelValue)

const handleInput = (event: any) => {
  if (!event.target) return
  userInfo.value = event.target.value
  emit('update:modelValue', event.target.value)
}
</script>
<style scoped lang="scss">
@use '@/assets/styles/index';
@include index.input-text;
</style>
