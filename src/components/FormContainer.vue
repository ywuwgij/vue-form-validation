<template>
  <form v-on:submit.stop.prevent="onSubmit">
    <slot></slot>
  </form>
</template>

<script>

export default {
  props: {

  },
  methods: {
    onSubmit() {
      let validResult = true
      for (var index in this.$children) {
        let child = this.$children[index]
        validResult = child.valid() && validResult
      }
      this.$emit('validation', validResult)
    }
  }
}
</script>

<style>
</style>
