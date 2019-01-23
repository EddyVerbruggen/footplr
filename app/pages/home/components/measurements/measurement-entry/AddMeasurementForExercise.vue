<template>
  <StackLayout verticalAlignment="center">
    <Dribble :player="player" v-if="exercise === 'DRIBBLE'"></Dribble>
    <Heartrate :player="player" v-if="exercise === 'HEARTRATE'"></Heartrate>
    <PushUps :player="player" v-if="exercise === 'PUSH_UPS'"></PushUps>
    <SitUps :player="player" v-if="exercise === 'SIT_UPS'"></SitUps>
    <HeaderHeight :player="player" v-if="exercise === 'HEADER_HEIGHT'"></HeaderHeight>
    <ShotStrength :player="player" v-if="exercise === 'SHOT_STRENGTH'"></ShotStrength>
    <Sprint :player="player" v-if="exercise === 'SPRINT'"></Sprint>
    <Explosiveness :player="player" v-if="exercise === 'EXPLOSIVENESS'"></Explosiveness>
    <Aim :player="player" v-if="exercise === 'AIM'"></Aim>
  </StackLayout>
</template>

<script>
  import Dribble from "./exercise/Dribble";
  import Heartrate from "./exercise/Heartrate";
  import PushUps from "./exercise/PushUps";
  import SitUps from "./exercise/SitUps";
  import HeaderHeight from "./exercise/HeaderHeight";
  import ShotStrength from "./exercise/ShotStrength";
  import Sprint from "./exercise/Sprint";
  import Explosiveness from "./exercise/Explosiveness";
  import Aim from "./exercise/Aim";

  export default {
    components: {
      Dribble,
      Heartrate,
      PushUps,
      SitUps,
      HeaderHeight,
      ShotStrength,
      Sprint,
      Explosiveness,
      Aim,
    },

    props: ['exercise', 'player'],
  };
</script>
