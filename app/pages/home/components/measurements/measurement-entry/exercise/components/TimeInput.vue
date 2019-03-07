<template>
  <StackLayout orientation="horizontal" horizontalAlignment="center">
    <Button :text="stopwatchLabel" @tap="stopwatchTapped" class="btn btn-stopwatch"
            horizontalAlignment="center" verticalAlignment="center" v-show="elapsed === 0 || stopwatchLabel === 'STOP'"></Button>
    <Button text="RESET" @tap="clearInput" class="btn btn-stopwatch btn-reset" v-show="elapsed > 0 && stopwatchLabel === 'START'"
            horizontalAlignment="center" verticalAlignment="center"></Button>
    <NumericKeyboard @focus="onFocus" @textChange="textChange" :text="elapsedFormatted" locale="nl_NL"
                     returnKeyTitle="OK" horizontalAlignment="center" class="numeric-input"></NumericKeyboard>
  </StackLayout>
</template>

<script lang="ts">
  import {EventBus} from "~/services/event-bus";
  import {isAndroid} from "tns-core-modules/platform";

  export default {
    props: ['player'],

    data() {
      return {
        stopwatchLabel: "START",
        elapsed: 0.00,
        elapsedFormatted: "0.00"
      }
    },

    methods: {
      stopwatchTapped() {
        if (this.intervalId) {
          // stopwatch is running
          this.stop();
        } else {
          this.start();
        }
      },

      clearInput() {
        this.elapsed = 0.00;
        this.elapsedFormatted = "0.00";
        EventBus.$emit("score-entered", {measurement: this.elapsed, player: this.player});
      },

      start() {
        this.stopwatchLabel = "STOP";
        const start = new Date().getTime();
        this.intervalId = setInterval(() => {
          this.elapsed = Math.round((new Date().getTime() - start) / 10) / 100;
          this.formatElapsed();
        }, 10);
      },

      stop() {
        clearInterval(this.intervalId);
        this.intervalId = undefined;
        this.stopwatchLabel = "START";
        EventBus.$emit("score-entered", {measurement: this.elapsed, player: this.player});
      },

      formatElapsed() {
        let elapsed = "" + this.elapsed;
        while (elapsed.substring(elapsed.indexOf(".")).length < 3) {
          elapsed += (elapsed.indexOf(".") === -1 ? "." : "0");
        }
        this.elapsedFormatted = elapsed;
      },

      textChange(event) {
        if (this.intervalId) {
          // stopwatch is running, so ignore
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

<style scoped>
  Button.btn-stopwatch {
    border-width: 4;
    border-radius: 10;
    border-color: #1c70b7;
    font-size: 14;
    background-color: #2699fb;
    color: #fff;
    min-width: 120;
  }

  Button.btn-stopwatch.btn-reset {
    border-color: #b43e3e;
    background-color: #f75454;
  }
</style>
