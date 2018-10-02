<template>
  <GridLayout rows="auto, auto, *" colums="*" verticalAlignment="top" height="100%">
    <GridLayout row="1" columns="2*, 3*, *, 2*" class="scoreTable">
      <Label col="0" text="Datum" class="m-l-10 p-y-10 p-x-5 bold"/>
      <Label col="1" :text="exercise + ' ▽'" class="p-y-10 p-x-5 bold" @tap="filterExercise"/>
      <Label col="2" text="Score" class=" p-y-10 p-x-5 bold" horizontalAlignment="right"/>
      <Label col="3" text="Officieel" class="m-r-10 p-y-10 p-x-5 bold" horizontalAlignment="right"/>
    </GridLayout>

    <ListView row="2" for="(item, index) in measurements" @itemTap="onItemTap" separatorColor="transparent" class="scoreTable">
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

  export default {
    created() {
      console.log("MeasurementsList created");
      this.fetchMeasurements();
    },

    data() {
      return {
        exercise: "Alle oefeningen",
        player: undefined,
        selectedListOrGraphIndex: 1,
        measurements
      }
    },

    methods: {
      fetchMeasurements(filterExercise = undefined) {
        const result = [];
        let query = authService.userRef.collection("measurements")
            .orderBy("date", "desc");

        if (filterExercise) {
          query = query.where("exercise", "==", filterExercise);
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
        const translatedOptions = ["Alle oefeningen"].concat(Object.keys(ExerciseType).map(k => translateExerciseType(k)));
        action({
          title: "Kies een oefening..",
          actions: translatedOptions
        }).then(picked => {
          if (picked && picked !== this.exercise) {
            this.exercise = picked;
            const options = ["Alle oefeningen"].concat(Object.keys(ExerciseType));
            const optionPicked = options[translatedOptions.indexOf(picked)];
            this.fetchMeasurements(optionPicked === "Alle oefeningen" ? undefined : optionPicked)
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