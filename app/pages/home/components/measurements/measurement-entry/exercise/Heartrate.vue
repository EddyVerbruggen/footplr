<template>
  <GridLayout columns="*, 10, *" horizontalAlignment="center">
    <!--SegmentedBar row="0" colSpan="3" class="m-t-20" @selectedIndexChange="onSelectedIndexChanged" horizontalAlignment="center">
      <SegmentedBarItem title="zonder hartslagmeter"></SegmentedBarItem>
      <SegmentedBarItem title="gebruik hartslagmeter"></SegmentedBarItem>
    </SegmentedBar-->

    <NumericKeyboard col="0" ref="nrOfBeats1" @blur="blurNrOfBeats" hint="Meting 1" locale="nl_NL" noDecimals="true"
                     returnKeyTitle="OK" horizontalAlignment="center" class="numeric-input"></NumericKeyboard>
    <NumericKeyboard col="2" ref="nrOfBeats2" @blur="blurNrOfBeats" hint="Meting 2" locale="nl_NL" noDecimals="true"
                     returnKeyTitle="OK" horizontalAlignment="center" class="numeric-input"></NumericKeyboard>
  </GridLayout>
</template>

<script>
  import {EventBus} from "~/services/event-bus";
  import {Excercises} from "~/shared/exercises";

  export default {
    props: ['player'],

    data() {
      return {
        hasHeartrateDevice: false,
      }
    },

    methods: {
      onSelectedIndexChanged() {
        this.hasHeartrateDevice = !this.hasHeartrateDevice;
      },

      blurNrOfBeats() {
        // TODO there was a logged crash in Firebase from Bas' device: "cannot read nativeView of undefined", so added a try-catch for now.. and see if we can reproduce it
        try {
          if (this.$refs.nrOfBeats1.nativeView.text && this.$refs.nrOfBeats2.nativeView.text) {
            const factor = this.hasHeartrateDevice ? 1 : 4;
            const measurement = (this.$refs.nrOfBeats1.nativeView.text * factor) - (this.$refs.nrOfBeats2.nativeView.text * factor);
            EventBus.$emit("score-entered", {measurement, player: this.player});
          }
        } catch (e) {
          console.log(">> error caught in blurNrOfBeats: " + e);
        }
      }
    }
  };
</script>

<style scoped>
</style>
