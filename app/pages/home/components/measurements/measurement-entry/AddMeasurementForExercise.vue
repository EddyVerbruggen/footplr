<template>
  <StackLayout verticalAlignment="center">
    <Dribble :player="player" v-if="exercise === 'DRIBBLE'"></Dribble>
    <Heartrate :player="player" v-if="exercise === 'HEARTRATE'"></Heartrate>
    <PushUps :player="player" v-if="exercise === 'PUSH_UPS'"></PushUps>
  </StackLayout>
</template>

<script>
  import Dribble from "./exercise/Dribble";
  import Heartrate from "./exercise/Heartrate";
  import PushUps from "./exercise/PushUps";

  export default {
    components: {
      Dribble,
      Heartrate,
      PushUps,
    },

    props: ['exercise', 'player'],
  };
</script>
