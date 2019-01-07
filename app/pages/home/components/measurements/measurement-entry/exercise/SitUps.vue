<template>
  <NumberInput :player="player"></NumberInput>
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
