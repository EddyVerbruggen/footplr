<template>
  <NumericKeyboard @textChange="textChange" hint="Aantal" locale="nl_NL" :noDecimals="!decimals" returnKeyTitle="OK" horizontalAlignment="center" class="numeric-input"></NumericKeyboard>
</template>

<script>
  import {EventBus} from "~/services/event-bus";

  export default {
    props: ['decimals', 'player'],

    methods: {
      textChange(event) {
        EventBus.$emit("score-entered", {measurement: event.object.text, player: this.player});
      },
    }
  };
</script>
