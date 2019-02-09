<template>
  <NumberInput :player="player" hint="punten" decimals="true"></NumberInput>
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
