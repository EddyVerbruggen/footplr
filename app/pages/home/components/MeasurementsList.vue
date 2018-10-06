<template>
  <GridLayout rows="auto, *" verticalAlignment="top" height="100%">

    <GridLayout row="0" columns="2*, 3*, *, 2*" class="scoreTable" style="background-color: #CBE3F0">
      <Label col="0" text="Datum" class="m-l-10 p-y-10 p-x-5 bold"/>
      <Label col="1" :text="exerciseTranslated + ' ▽'" class="p-y-10 p-x-5 bold" @tap="filterExercise"/>
      <Label col="2" text="Score" class=" p-y-10 p-x-5 bold" horizontalAlignment="right"/>
      <Label col="3" text="Officieel" class="m-r-10 p-y-10 p-x-5 bold" horizontalAlignment="right"/>
    </GridLayout>

    <ListView row="1" for="(item, index) in measurements" @itemTap="onItemTap" separatorColor="transparent" class="scoreTable">
      <v-template>
        <GridLayout columns="2*, 3*, *, 2*" class="listview-separator">
          <Label col="0" :text="item.date" class="m-l-10 p-y-10 p-x-5"/>
          <Label col="1" :text="item.exercise" class="p-y-10 p-x-5"/>
          <Label col="2" :text="item.score" class="p-y-10 p-x-5" horizontalAlignment="right"/>
          <Label col="3" :text="item.official" class="m-r-10 p-y-10 p-x-5" horizontalAlignment="right"/>
        </GridLayout>
      </v-template>
    </ListView>
  </GridLayout>
</template>

<script>
  import {authService} from "~/main";
  import {formatDate} from "~/utils/date-util";
  import {ExerciseType, translateExerciseType} from "~/shared/exercises";
  import {action} from "tns-core-modules/ui/dialogs";

  const measurements = [];
  const ALL_EXERCISES = "Alle oefeningen";

  export default {
    created() {
      console.log("MeasurementsList created");
      authService.anyPageCallback = () => this.fetchMeasurements(this.exercise);
    },

    data() {
      return {
        exercise: ALL_EXERCISES,
        exerciseTranslated: ALL_EXERCISES,
        player: undefined,
        selectedListOrGraphIndex: 1,
        measurements
      }
    },

    methods: {
      fetchMeasurements() {
        const result = [];
        let query = authService.userRef
            .collection("measurements")
            .orderBy("date", "desc");

        if (this.exercise !== ALL_EXERCISES) {
          query = query.where("exercise", "==", this.exercise);
        }

        query
            .limit(200) // we need to limit it somewhere, right?
            .get()
            .then(m => {
              m.forEach(s => {
                const measurementData = s.data();
                result.push({
                  date: formatDate(measurementData.date),
                  exercise: translateExerciseType(measurementData.exercise),
                  score: measurementData.score,
                  official: measurementData.official ? "☑️" : ""
                });
              });
              this.measurements = result
            })
            .catch(err => console.log(err));
      },
      filterExercise() {
        const translatedOptions = [ALL_EXERCISES].concat(Object.keys(ExerciseType).map(k => translateExerciseType(k)));
        action({
          title: "Kies een oefening..",
          actions: translatedOptions
        }).then(picked => {
          if (picked && picked !== this.exerciseTranslated) {
            const options = [ALL_EXERCISES].concat(Object.keys(ExerciseType));
            const optionPicked = options[translatedOptions.indexOf(picked)];
            this.exercise = optionPicked;
            this.exerciseTranslated = picked;
            this.fetchMeasurements(optionPicked === ALL_EXERCISES ? undefined : optionPicked)
          }
        });
      }
    }
  };
</script>

<style scoped>
  .scoreTable Label {
    font-size: 12;
  }
</style>