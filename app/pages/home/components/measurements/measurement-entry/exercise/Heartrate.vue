<template>
  <GridLayout columns="*, 10, *" horizontalAlignment="center">
    <NumericKeyboard col="0" ref="nrOfBeats1" @blur="blurNrOfBeats" hint="Meting 1" locale="nl_NL" noDecimals="true" returnKeyTitle="OK" horizontalAlignment="center" class="numeric-input"></NumericKeyboard>
    <NumericKeyboard col="2" ref="nrOfBeats2" @blur="blurNrOfBeats" hint="Meting 2" locale="nl_NL" noDecimals="true" returnKeyTitle="OK" horizontalAlignment="center" class="numeric-input"></NumericKeyboard>
  </GridLayout>
</template>

<script>
  import {EventBus} from "~/services/event-bus";
  import {Excercises} from "~/shared/exercises";

  export default {
    props: ['player'],

    methods: {
      blurNrOfBeats() {
        if (this.$refs.nrOfBeats1.nativeView.text && this.$refs.nrOfBeats2.nativeView.text) {
          const measurement = (this.$refs.nrOfBeats1.nativeView.text * 4) - (this.$refs.nrOfBeats2.nativeView.text * 4);
          EventBus.$emit("score-entered", {measurement, player: this.player});
        }
      }
    }
  };
</script>

<style scoped>
</style>
