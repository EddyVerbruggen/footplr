<template>
  <GridLayout columns="*, 10, *" horizontalAlignment="center">
    <NumericKeyboard col="0" ref="nrOfBeats1" @textChange="textChange" hint="Meting 1" locale="nl_NL" noDecimals="true" returnKeyTitle="OK" horizontalAlignment="center" class="numeric-input"></NumericKeyboard>
    <NumericKeyboard col="2" ref="nrOfBeats2" @textChange="textChange" hint="Meting 2" locale="nl_NL" noDecimals="true" returnKeyTitle="OK" horizontalAlignment="center" class="numeric-input"></NumericKeyboard>
  </GridLayout>
</template>

<script>
  import {EventBus} from "~/services/event-bus";
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
      textChange() {
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
