<template>
  <GridLayout columns="*, 10, *" horizontalAlignment="center">
    <NumericKeyboard col="0" ref="nrOfBeats1" @blur="blurNrOfBeats" hint="Meting 1" locale="nl_NL" noDecimals="true" returnKeyTitle="OK" horizontalAlignment="center" class="numeric-input" v-if="isIOS"></NumericKeyboard>
    <TextField col="0" ref="nrOfBeats1" keyboardType="number" @focus="onFocus" @blur="blurNrOfBeats" hint="Meting 1" horizontalAlignment="center" class="numeric-input" v-if="!isIOS"></TextField>

    <NumericKeyboard col="2" ref="nrOfBeats2" @blur="blurNrOfBeats" hint="Meting 2" locale="nl_NL" noDecimals="true" returnKeyTitle="OK" horizontalAlignment="center" class="numeric-input" v-if="isIOS"></NumericKeyboard>
    <TextField col="2" ref="nrOfBeats2" keyboardType="number" @focus="onFocus" @blur="blurNrOfBeats" hint="Meting 2" horizontalAlignment="center" class="numeric-input" v-if="!isIOS"></TextField>
  </GridLayout>
</template>

<script>
  import {EventBus} from "~/services/event-bus";
  import {Excercises} from "~/shared/exercises";
  import {isAndroid, isIOS} from "tns-core-modules/platform";
  import {setCurrentlyActiveElement} from "~/utils/keyboard-util";

  export default {
    props: ['player'],

    data() {
      return {
        isIOS
      }
    },

    methods: {
      onFocus(event) {
        if (isAndroid) {
          setCurrentlyActiveElement(event.object);
        }
      },
      blurNrOfBeats() {
        if (this.$refs.nrOfBeats1 && this.$refs.nrOfBeats1.nativeView.text && this.$refs.nrOfBeats2 && this.$refs.nrOfBeats2.nativeView.text) {
          const measurement = this.$refs.nrOfBeats1.nativeView.text - this.$refs.nrOfBeats2.nativeView.text;
          EventBus.$emit("score-entered", {measurement, player: this.player});
        }
      }
    }
  };
</script>

<style scoped>
</style>
