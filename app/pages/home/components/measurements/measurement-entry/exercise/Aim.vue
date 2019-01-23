<template>
  <NumberInput :player="player" hint="score"></NumberInput>
</template>

<script>
  import NumberInput from "./components/NumberInput";

  export default {
    components: {
      NumberInput
    },

    props: ['player'],
  };
</script>
