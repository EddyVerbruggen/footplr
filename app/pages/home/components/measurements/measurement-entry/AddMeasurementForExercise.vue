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
    <Stamina :player="player" v-if="exercise === 'STAMINA'"></Stamina>
    <SpeedOfAction :player="player" v-if="exercise === 'SPEED_OF_ACTION'"></SpeedOfAction>
    <PassingMovements :player="player" v-if="exercise === 'PASSING_MOVEMENTS'"></PassingMovements>
    <ControlLowBall :player="player" v-if="exercise === 'CONTROL_LOW_BALL'"></ControlLowBall>
    <ControlHighBall :player="player" v-if="exercise === 'CONTROL_HIGH_BALL'"></ControlHighBall>
    <Crosspass :player="player" v-if="exercise === 'CROSSPASS'"></Crosspass>
    <JumpHeight :player="player" v-if="exercise === 'JUMP_HEIGHT'"></JumpHeight>
    <Agility :player="player" v-if="exercise === 'AGILITY'"></Agility>
  </StackLayout>
</template>

<script lang="ts">
  import Agility from "./exercise/Agility";
  import Aim from "./exercise/Aim";
  import ControlHighBall from "./exercise/ControlHighBall";
  import ControlLowBall from "./exercise/ControlLowBall";
  import Crosspass from "./exercise/Crosspass";
  import Dribble from "./exercise/Dribble";
  import Explosiveness from "./exercise/Explosiveness";
  import HeaderHeight from "./exercise/HeaderHeight";
  import Heartrate from "./exercise/Heartrate";
  import JumpHeight from "./exercise/JumpHeight";
  import PassingMovements from "./exercise/PassingMovements";
  import PushUps from "./exercise/PushUps";
  import ShotStrength from "./exercise/ShotStrength";
  import SitUps from "./exercise/SitUps";
  import SpeedOfAction from "./exercise/SpeedOfAction";
  import Sprint from "./exercise/Sprint";
  import Stamina from "./exercise/Stamina";

  export default {
    components: {
      SpeedOfAction,
      Stamina,
      PassingMovements,
      Dribble,
      Heartrate,
      PushUps,
      SitUps,
      HeaderHeight,
      ShotStrength,
      Sprint,
      Explosiveness,
      Aim,
      ControlLowBall,
      ControlHighBall,
      Crosspass,
      JumpHeight,
      Agility
    },

    props: ['exercise', 'player'],
  };
</script>
