<template>
  <TimeInput :player="player"></TimeInput>
</template>

<script>
  import TimeInput from "./components/TimeInput";

  export default {
    components: {
      TimeInput
    },

    props: ['player'],
  };
</script>
