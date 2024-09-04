<template>
  <input required v-model="userInfo" @input="handleInput($event)" type="time" placeholder="" />
  <i>{{ props.name }}</i>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  modelValue: null | string
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

watch(
  () => props.modelValue,
  () => {
    userInfo.value = props.modelValue
  }
)
</script>
<style scoped lang="scss">
@use '@/assets/styles/index';
@include index.input-text;
</style>
