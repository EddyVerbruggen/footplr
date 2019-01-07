<template>
  <StackLayout horizontalAlignment="center">
    <Label :text="countdown" class="countdown" horizontalAlignment="center"></Label>
    <Button :text="text" @tap="timerTapped" class="btn btn-timer" horizontalAlignment="center"></Button>
  </StackLayout>
</template>

<script>
  export default {
    created() {
      console.log("Timer created");
    },

    // these have been passed to the modal and can be accessed as this.<property>
    props: ['label', 'hint', 'duration'],

    mounted() {
      this.formatCountdown(this.duration);
    },

    data() {
      return {
        text: this.label,
        countdown: undefined
      }
    },

    methods: {
      timerTapped() {
        if (this.intervalId) {
          return;
        }
        let duration = parseInt(this.duration);
        if (this.hint) {
          this.text = this.hint;
        }
        this.intervalId = setInterval(() => {
          this.formatCountdown(--duration);
          if (duration === 0) {
            // TODO play sound
            clearInterval(this.intervalId);
            this.intervalId = undefined;
            this.text = "Klaar!";
            setTimeout(() => {
              this.formatCountdown(this.duration);
              this.text = this.label;
            }, 2000);
          }
        }, 1000);
      },

      formatCountdown(seconds) {
        // blondly assuming max seconds is 60 😇
        this.countdown = `00:00:${seconds < 10 ? '0' : ''}${seconds}`;
      }
    }
  };
</script>

<style scoped>
  Button.btn-timer {
    border-width: 4;
    border-radius: 10;
    border-color: #1c70b7;
    font-size: 14;
    background-color: #2699fb;
    color: #fff;
    min-width: 120;
    height: 44;
  }

  Label.countdown {
    font-size: 40;
    color: red;
  }
</style>
