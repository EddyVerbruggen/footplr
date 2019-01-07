<template>
  <StackLayout verticalAlignment="center">
    <Dribble :player="player" v-if="exercise === 'DRIBBLE'"></Dribble>
    <Heartrate :player="player" v-if="exercise === 'HEARTRATE'"></Heartrate>
    <PushUps :player="player" v-if="exercise === 'PUSH_UPS'"></PushUps>
    <SitUps :player="player" v-if="exercise === 'SIT_UPS'"></SitUps>
  </StackLayout>
</template>

<script>
  import Dribble from "./exercise/Dribble";
  import Heartrate from "./exercise/Heartrate";
  import PushUps from "./exercise/PushUps";
  import SitUps from "./exercise/SitUps";

  export default {
    components: {
      Dribble,
      Heartrate,
      PushUps,
      SitUps,
    },

    props: ['exercise', 'player'],
  };
</script>
