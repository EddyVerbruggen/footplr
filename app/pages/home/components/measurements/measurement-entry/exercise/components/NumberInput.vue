<template>
  <NumericKeyboard @focus="onFocus" @textChange="textChange" hint="Aantal" locale="nl_NL" :noDecimals="!decimals"
                   returnKeyTitle="OK" horizontalAlignment="center" class="numeric-input"></NumericKeyboard>
</template>

<script>
  import {EventBus} from "~/services/event-bus";
  import {isAndroid} from "tns-core-modules/platform";
  import {setCurrentlyActiveElement} from "~/utils/keyboard-util";

  export default {
    props: ['decimals', 'player'],

    methods: {
      textChange(event) {
        if (!this.player) {
          console.log("Player not set - not saving!");
          return;
        }
        EventBus.$emit("score-entered", {measurement: event.object.text, player: this.player});
      },

      onFocus(event) {
        if (isAndroid) {
          // setCurrentlyActiveElement(event.object);
        }
      },
    }
  };
</script>
