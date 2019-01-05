<template>
  <Button :text="text" @tap="timerTapped" class="btn btn-secondary btn-timer"></Button>
</template>

<script>
  export default {
    created() {
      console.log("Timer created");
    },

    // these have been passed to the modal and can be accessed as this.<property>
    props: ['label', 'duration'],

    mounted() {
    },

    data() {
      return {
        text: this.label
      }
    },

    methods: {
      timerTapped() {
        let duration = parseInt(this.duration);
        this.text = duration;
        this.intervalId = setInterval(() => {
          this.text = --duration;
          if (this.text === 0) {
            clearInterval(this.intervalId);
            setTimeout(() => {
              this.text = "Herstart timer";
            }, 3000);
          }
        }, 1000);
      },
    }
  };
</script>

<style scoped>
  Button.btn-timer {
    border-width: 4;
    border-radius: 10;
    font-size: 14;
  }
</style>
