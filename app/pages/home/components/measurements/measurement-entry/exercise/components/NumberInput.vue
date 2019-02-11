<template>
  <NumericKeyboard @focus="onFocus" @textChange="textChange" :hint="hint" locale="nl_NL" :noDecimals="!decimals"
                   returnKeyTitle="OK" horizontalAlignment="center" class="numeric-input"></NumericKeyboard>
</template>

<script lang="ts">
  import { isAndroid } from "tns-core-modules/platform";
  import { EventBus } from "~/services/event-bus";

  export default {
    props: ['decimals', 'player', 'hint'],

    mounted() {
      // set a default for the input hint
      if (!this.hint) {
        this.hint = "aantal"
      }
    },

    methods: {
      textChange(event) {
        if (!this.player) {
          console.log("Player not set - not saving!");
          return;
        }
        EventBus.$emit("score-entered", {measurement: event.object.text.replace(",", "."), player: this.player});
      },

      onFocus(event) {
        if (isAndroid) {
          // setCurrentlyActiveElement(event.object);
        }
      },
    }
  };
</script>
