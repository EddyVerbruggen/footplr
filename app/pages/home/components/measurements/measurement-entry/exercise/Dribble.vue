<template>
  <StackLayout>
    <!--<Stopwatch></Stopwatch>-->

    <TextField width="50" height="50" keyboardType="number" v-model="score" hint="Score" horizontalAlignment="center"></TextField>

    <!--<GridLayout id="header" colSpan="2" rows="2*, *" class="p-r-20 p-t-70" :class="'background-color-score-' + scoreClass" @loaded="headerLoaded">-->
      <!--<Label row="0" :text="exerciseTranslated" color="#fff" class="bold exercise" horizontalAlignment="right" verticalAlignment="bottom"></Label>-->
      <!--<Button row="1" text="UITLEG" class="btn btn-secondary btn-explanation" width="140" @tap="doShowExplanation()" horizontalAlignment="right" v-if="!showExplanation"></Button>-->
      <!--<Label row="1" color="#fff" class="c-white m-30 p-t-70" text="Uitleg hier, neem wat bier.. of doe maar niet, omdat je dan scheef schiet. Uitleg hier, neem wat bier.. of doe maar niet, omdat je dan scheef schiet. Uitleg hier, neem wat bier.. of doe maar niet, omdat je dan scheef schiet." textWrap="true" verticalAlignment="top" v-if="showExplanation"></Label>-->
    <!--</GridLayout>-->

    <!--<Slider row="2" colSpan="2" class="m-20" minValue="0" maxValue="100" width="90%" :value="score" @valueChange="sliderChanged" horizontalAlignment="center" v-if="!showExplanation"></Slider>-->
  </StackLayout>
</template>

<script>
  import {authService, editingUserService} from "~/main";
  import {formatDate} from "~/utils/date-util";
  import {translateExerciseType} from "~/shared/exercises";
  // import Stopwatch from "../Stopwatch";

  export default {
    components: {
      // Stopwatch
    },

    props: ['player'],

    created() {
      console.log("Dribble created");
    },

    // these have been passed to the modal and can be accessed as this.<property>
    // props: ['exercise', 'exerciseTranslated', 'previousScore'],

    mounted() {
    },

    data() {
      return {
        // isTrainer: authService.userWrapper.user.trains !== undefined,
        // date: new Date(),
        // maxDate: new Date(),
        // score: this.previousScore || 50,
        // scoreClass: this.scoreClass, // this is updated in mounted()
        // showExplanation: false,
      }
    },
    methods: {
      // sliderChanged(event) {
      //   this.score = parseInt(event.value);
      //   this.scoreClass = (Math.ceil(this.score / 10)) * 10;
      // },
    }
  };
</script>

<style scoped>
</style>
