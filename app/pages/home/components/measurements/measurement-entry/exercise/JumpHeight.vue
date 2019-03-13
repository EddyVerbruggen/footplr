<template>
  <GridLayout columns="*, 10, *" horizontalAlignment="center">
    <NumericKeyboard col="0" ref="height1" @textChange="textChange" hint="Bereik (cm)" locale="nl_NL" noDecimals="true" returnKeyTitle="OK" horizontalAlignment="center" class="numeric-input"></NumericKeyboard>
    <NumericKeyboard col="2" ref="height2" @textChange="textChange" hint="Sprong (cm)" locale="nl_NL" noDecimals="true" returnKeyTitle="OK" horizontalAlignment="center" class="numeric-input"></NumericKeyboard>
  </GridLayout>
</template>

<script lang="ts">
  import { isAndroid, isIOS } from "tns-core-modules/platform";
  import { EventBus } from "~/services/event-bus";
  import { setCurrentlyActiveElement } from "~/utils/keyboard-util";

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
        if (this.$refs.height1 && this.$refs.height1.nativeView.text && this.$refs.height2 && this.$refs.height2.nativeView.text) {
          const measurement = this.$refs.height2.nativeView.text - this.$refs.height1.nativeView.text;
          EventBus.$emit("score-entered", {measurement, player: this.player});
        }
      }
    }
  };
</script>

<style scoped>
</style>
