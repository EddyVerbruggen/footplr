<template>
  <Page>
    <GridLayout rows="auto, *, auto, auto, auto" columns="*, *" horizontalAlignment="center" height="100%">
      <Label row="0" colSpan="2" class="bold m-20" :text="exerciseTranslated"></Label>

      <Label row="1" colSpan="2" class="m-x-20" text="Uitleg hier, neem wat bier.. of doe maar niet, omdat je dan scheef schiet. Uitleg hier, neem wat bier.. of doe maar niet, omdat je dan scheef schiet. Uitleg hier, neem wat bier.. of doe maar niet, omdat je dan scheef schiet." textWrap="true" verticalAlignment="top"></Label>
      <!-- note that this page can be used to 'edit' a measurement as well -->

      <!--<TextField row="2" colSpan="2" width="50" height="50" keyboardType="number" v-model="score" hint="Score" horizontalAlignment="center"/>-->
      <Label row="2" colSpan="2" :text="score" class="bold" style="margin-bottom: 60; color: #63d4a5" horizontalAlignment="center"/>
      <Slider row="2" colSpan="2" class="m-20" minValue="0" maxValue="100" :value="score" @valueChange="sliderChanged" horizontalAlignment="center"/>

      <DatePicker row="3" colSpan="2" v-model="date" :maxDate="maxDate"/>

      <Button row="4" col="0" text="ANNULEREN" class="btn btn-secondary" @tap="$modal.close(false)"/>
      <Button row="4" col="1" text="OPSLAAN" class="btn btn-primary" @tap="saveScore()"/>
    </GridLayout>
  </Page>
</template>

<script>
  import {authService} from "~/main";
  import {formatDate} from "~/utils/date-util";
  import {translateExerciseType} from "~/shared/exercises";

  export default {
    created() {
      console.log("AddMeasurement created");
    },

    // these have been passed to the modal and can be accessed as this.<property>
    props: ['exercise', 'exerciseTranslated'],

    data() {
      return {
        date: new Date(),
        maxDate: new Date(),
        score: 50
      }
    },
    methods: {
      sliderChanged(event) {
        // console.log(">> event.value: " + parseInt(event.value));
        this.score = parseInt(event.value);
      },
      saveScore() {
        if (!this.score) {
          return;
        }

        const score = parseInt(this.score);
        if (score < 0 || score > 100) {
          return;
        }

        authService.userRef
            .collection("measurements")
            .add({
              date: this.date,
              score,
              exercise: this.exercise,
              official: true
            })
            .then(() => this.$modal.close(true))
            .catch(err => console.log(err));
      }
    }
  };
</script>

<style scoped>
  Page {
    margin: 30 0 0 0;
  }

</style>