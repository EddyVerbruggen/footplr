<template>
  <NumericKeyboard ref="input" @blur="blurInput" hint="Aantal" locale="nl_NL" :noDecimals="!decimals" returnKeyTitle="OK" horizontalAlignment="center"></NumericKeyboard>
</template>

<script>
  import {EventBus} from "~/services/event-bus";
  import {isIOS} from "tns-core-modules/platform"

  export default {
    created() {
      if (isIOS) {
        IQKeyboardManager.sharedManager().enableAutoToolbar = false;
      }
    },

    props: ['decimals', 'player'],

    methods: {
      blurInput() {
        EventBus.$emit("score-entered", {measurement: this.$refs.input.nativeView.text, player: this.player});
      }
    }
  };
</script>

<style scoped>
  TextField {
    text-align: right;
    font-size: 20;
    border-bottom-color: red;
    border-bottom-width: 1px;
    width: 90;
    padding: 12;
  }
</style>
