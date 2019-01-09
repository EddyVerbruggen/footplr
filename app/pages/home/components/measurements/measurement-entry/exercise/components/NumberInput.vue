<template>
  <StackLayout>
    <!-- TODO prolly we can use only NumericKeyboard again -->
    <NumericKeyboard @focus="onFocus" @blur="onBlur" hint="Aantal" locale="nl_NL" :noDecimals="!decimals" returnKeyTitle="OK" horizontalAlignment="center" class="numeric-input" v-if="isIOS"></NumericKeyboard>
    <TextField keyboardType="number" @focus="onFocus" @blur="onBlur" hint="Aantal" locale="nl_NL" :noDecimals="!decimals" returnKeyTitle="OK" horizontalAlignment="center" class="numeric-input" v-else></TextField>
  </StackLayout>
</template>

<script>
  import {EventBus} from "~/services/event-bus";
  import {isIOS} from "tns-core-modules/platform";
  import { setCurrentlyActiveElement } from "~/utils/keyboard-util";

  export default {
    props: ['decimals', 'player'],

    data() {
      return {
        isIOS,
      }
    },

    created() {
    },

    methods: {
      onFocus(event) {
        console.log("focus");
        EventBus.$emit("keyboard-showing", true);
        setCurrentlyActiveElement(event.object);
      },
      onBlur(event) {
        console.log("blur, event.object.text: " + event.object.text);
        EventBus.$emit("score-entered", {measurement: event.object.text, player: this.player});
      }
    }
  };
</script>
