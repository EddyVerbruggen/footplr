<template>
  <NumerInput :player="player"></NumerInput>
</template>

<script>
  import NumerInput from "./components/NumberInput";

  export default {
    components: {
      NumerInput
    },

    props: ['player'],
  };
</script>
