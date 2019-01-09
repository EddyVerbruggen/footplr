<template>
  <NumericKeyboard @focus="onFocus" @blur="onBlur" hint="Aantal" locale="nl_NL" :noDecimals="!decimals"
                   returnKeyTitle="OK" horizontalAlignment="center" class="numeric-input"></NumericKeyboard>
</template>

<script>
  import {EventBus} from "~/services/event-bus";
  import {isAndroid} from "tns-core-modules/platform";
  import {setCurrentlyActiveElement} from "~/utils/keyboard-util";

  export default {
    props: ['decimals', 'player'],

    methods: {
      onFocus(event) {
        if (isAndroid) {
          EventBus.$emit("keyboard-showing", true);
          setCurrentlyActiveElement(event.object);
        }
      },

      onBlur(event) {
        EventBus.$emit("score-entered", {measurement: event.object.text, player: this.player});
      }
    }
  };
</script>
