<template>
  <NumericKeyboard ref="input" @blur="blurInput" hint="Aantal" locale="nl_NL" :noDecimals="!decimals" returnKeyTitle="OK" horizontalAlignment="center" class="numeric-input"></NumericKeyboard>
</template>

<script>
  import {EventBus} from "~/services/event-bus";

  export default {
    props: ['decimals', 'player'],

    methods: {
      blurInput() {
        EventBus.$emit("score-entered", {measurement: this.$refs.input.nativeView.text, player: this.player});
      }
    }
  };
</script>
