<template>
  <Page>
    <GridLayout rows="auto, *, auto, auto, auto" columns="*, *" horizontalAlignment="center" verticalAlignment="top" height="100%">

      <GridLayout id="header" colSpan="2" rows="2*, *" class="p-r-20 p-t-70" :class="'background-color-score-' + scoreClass" @loaded="headerLoaded">
        <Label row="0" :text="exerciseTranslated" color="#fff" class="bold exercise" horizontalAlignment="right" verticalAlignment="bottom"></Label>
        <Button row="1" text="UITLEG" class="btn btn-secondary btn-explanation" width="140" @tap="doShowExplanation()" horizontalAlignment="right" v-if="!showExplanation"></Button>
        <Label row="1" color="#fff" class="c-white m-30 p-t-70" text="Uitleg hier, neem wat bier.. of doe maar niet, omdat je dan scheef schiet. Uitleg hier, neem wat bier.. of doe maar niet, omdat je dan scheef schiet. Uitleg hier, neem wat bier.. of doe maar niet, omdat je dan scheef schiet." textWrap="true" verticalAlignment="top" v-if="showExplanation"></Label>
      </GridLayout>

      <Image rowSpan="4" :src="'~/assets/images/exercises/' + exercise + '.png'" height="170" horizontalAlignment="left" verticalAlignment="top"></Image>

      <!--<Label row="1" colSpan="2" class="m-x-20 c-white" text="Uitleg hier, neem wat bier.. of doe maar niet, omdat je dan scheef schiet. Uitleg hier, neem wat bier.. of doe maar niet, omdat je dan scheef schiet. Uitleg hier, neem wat bier.. of doe maar niet, omdat je dan scheef schiet." textWrap="true" verticalAlignment="top" v-if="showExplanation"></Label>-->

      <!--<TextField row="2" colSpan="2" width="50" height="50" keyboardType="number" v-model="score" hint="Score" horizontalAlignment="center"/>-->
      <Label row="2" colSpan="2" :text="score" class="bold" style="margin-bottom: 60; color: #63d4a5" horizontalAlignment="center" v-if="!showExplanation"></Label>
      <Slider row="2" colSpan="2" class="m-20" minValue="0" maxValue="100" width="90%" :value="score" @valueChange="sliderChanged" horizontalAlignment="center" v-if="!showExplanation"></Slider>

      <DatePicker row="3" colSpan="2" v-model="date" :maxDate="maxDate" v-if="!showExplanation"></DatePicker>

      <Button row="4" col="0" text="ANNULEREN" class="btn btn-secondary" @tap="$modal.close(false)" v-if="!showExplanation"></Button>
      <Button row="4" col="1" text="OPSLAAN" class="btn btn-primary" @tap="saveScore()" v-if="!showExplanation"></Button>
      <Button row="4" col="1" text="TERUG" class="btn btn-secondary-colorless" :class="'color-score-' + scoreClass" @tap="showExplanation = false" v-if="showExplanation"></Button>
    </GridLayout>
  </Page>
</template>

<script>
  import {authService, editingUserService} from "~/main";
  import {formatDate} from "~/utils/date-util";
  import {translateExerciseType} from "~/shared/exercises";

  export default {
    created() {
      console.log("AddMeasurement created");
    },

    // these have been passed to the modal and can be accessed as this.<property>
    props: ['exercise', 'exerciseTranslated', 'previousScore'],

    mounted() {
      this.scoreClass = (Math.ceil(this.score / 10)) * 10;
    },

    data() {
      return {
        date: new Date(),
        maxDate: new Date(),
        score: this.previousScore || 50,
        scoreClass: this.scoreClass, // this is updated in mounted()
        showExplanation: false,
      }
    },
    methods: {
      headerLoaded(event) {
        this.header = event.object;
      },
      doShowExplanation() {
        this.showExplanation = true;
      },
      sliderChanged(event) {
        this.score = parseInt(event.value);
        this.scoreClass = (Math.ceil(this.score / 10)) * 10;
      },
      saveScore() {
        if (!this.score) {
          return;
        }

        const score = parseInt(this.score);
        if (score < 0 || score > 100) {
          return;
        }

        editingUserService.userRef
            .collection("measurements")
            .add({
              date: this.date,
              score,
              exercise: this.exercise,
              official: editingUserService.userWrapper.user.id !== authService.userWrapper.user.id
            })
            .then(() => this.$modal.close(true))
            .catch(err => console.log(err));
      }
    }
  };
</script>

<style scoped>
  Page {
    /*margin: 30 0 0 0;*/
  }

  .exercise {
    font-size: 22;
  }

  Button.btn-explanation {
    border-width: 2;
    border-color: #fff;
    color: #fff;
    margin: 24 0 24 16;
  }
</style>
