<template>
  <GridLayout rows="auto, auto" columns="3*, 2*" horizontalAlignment="center">
    <Timer duration="15" label="Start eerste meting"></Timer>
    <TextField col="1" width="120" keyboardType="number" v-model="nrOfBeats1st" @blur="blurNrOfBeats" hint="Aantal slagen"></TextField>

    <Timer row="1" duration="15" label="Start tweede meting"></Timer>
    <TextField row="1" col="1" width="120" keyboardType="number" v-model="nrOfBeats2nd" @blur="blurNrOfBeats" hint="Aantal slagen"></TextField>
  </GridLayout>
</template>

<script>
  import Timer from "../Timer";
  import {EventBus} from "~/services/event-bus";
  import {Excercises} from "~/shared/exercises";

  export default {
    components: {
      Timer
    },

    created() {
      console.log("Heartrate created");
    },

    mounted() {
    },

    data() {
      return {
        nrOfBeats1st: undefined,
        nrOfBeats2nd: undefined
      }
    },
    methods: {
      blurNrOfBeats() {
        if (this.nrOfBeats1st && this.nrOfBeats2nd) {
          const measurement = (this.nrOfBeats1st * 4) - (this.nrOfBeats2nd * 4);
          EventBus.$emit("score-entered", {measurement});
        }
      }
    }
  };
</script>

<style scoped>
</style>
