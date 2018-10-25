<template>
  <Page>
    <GridLayout rows="auto, auto, *, auto" columns="*, *" verticalAlignment="top" height="100%">
      <Label row="0" colSpan="2" :text="exerciseTranslated"></Label>

      <!-- note that this page can be used to 'edit' a measurement as well -->

      <DatePicker row="1" colSpan="2" v-model="date"/>

      <TextField row="2" colSpan="2" v-model="score" hint="Score?"/>

      <Button row="3" col="0" text="Annuleren" class="btn btn-secondary" @tap="$modal.close(false)"/>
      <Button row="3" col="1" text="OPSLAAN" class="btn btn-primary" @tap="saveScore()"/>

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
        score: undefined
      }
    },
    methods: {
      saveScore() {
        // TODO validate (score 0-100, etc)
        authService.userRef
            .collection("measurements")
            .add({
              date: this.date,
              score: +this.score,
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
    margin: 30 0 20 0;
  }

</style>