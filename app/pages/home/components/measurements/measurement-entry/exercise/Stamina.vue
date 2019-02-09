<template>
  <NumberInput :player="player" hint="trappen"></NumberInput>
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
