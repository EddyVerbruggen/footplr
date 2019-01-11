<template>
  <NumericKeyboard @focus="onFocus" @blur="onBlur" @textChange="textChange" hint="Aantal" locale="nl_NL"
                   :noDecimals="!decimals" returnKeyTitle="OK" horizontalAlignment="center"
                   class="numeric-input"></NumericKeyboard>
</template>

<script>
  import {EventBus} from "~/services/event-bus";
  import {isAndroid} from "tns-core-modules/platform";
  import {setCurrentlyActiveElement} from "~/utils/keyboard-util";

  export default {
    props: ['decimals', 'player'],

    methods: {
      textChange(event) {
        EventBus.$emit("score-entered", {measurement: event.object.text, player: this.player});
      },

      onFocus(event) {
        console.log(">> onFocus");
        if (isAndroid) {
          EventBus.$emit("keyboard-showing", true);
          setCurrentlyActiveElement(event.object);
        }
      },

      onBlur(event) {
        console.log(">> onBlur");
        // EventBus.$emit("score-entered", {measurement: event.object.text, player: this.player});
      }
    }
  };
</script>
