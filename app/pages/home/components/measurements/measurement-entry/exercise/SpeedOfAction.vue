<template>
  <NumberInput :player="player" hint="score"></NumberInput>
</template>

<script lang="ts">
  import NumberInput from "./components/NumberInput";

  export default {
    components: {
      NumberInput
    },

    props: ['player'],
  };
</script>
