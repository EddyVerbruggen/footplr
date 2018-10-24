<template>
  <GridLayout rows="auto, *" verticalAlignment="top" height="100%">

    <!-- TODO for trainer/admin <Label row="0" text="Voor trainers: filter op speler"/>-->

    <ListView row="0" for="(item, index) in measurements" separatorColor="transparent" class="scoreTable">
      <v-template>
        <GridLayout columns="46, 2*, 2*">
          <Label col="0" :text="item.score" class="m-l-10 m-y-4 p-y-5 p-x-5 c-bg-orange c-white" horizontalAlignment="center"/>
          <Label col="1" :text="item.exercise" class="p-y-10 p-x-5"/>
          <Button col="2" text="grafiek" class="p-y-10 p-x-5 m-r-10" horizontalAlignment="right" @tap="goToGraph(item.exercise)"/>
        </GridLayout>
      </v-template>
    </ListView>
  </GridLayout>
</template>

<script>
  import {authService} from "~/main";
  import {formatDate} from "~/utils/date-util";
  import {ExerciseType, translateExerciseType} from "~/shared/exercises";

  // const measurements = [];

  export default {
    created() {
      console.log("MeasurementsOverview created");
      // authService.anyPageCallback = () => this.fetchMeasurements(this.exercise);
      this.fetchMeasurements();
    },

    data() {
      return {
        player: undefined,
        measurements: []
      }
    },

    methods: {
      goToGraph(exercise) {
        console.log("exercise: " + exercise);
        this.$parent.exercise = exercise;
        this.$parent.selectedListOrGraphIndex = 1;
        // this.$navigateTo(routes.login, {clearHistory: true});
      },

      fetchMeasurements() {
        console.log(">>> authService.userWrapper.user.latestmeasurements: " + JSON.stringify(authService.userWrapper.user.latestmeasurements));

        const latestMeasurements = authService.userWrapper.user.latestmeasurements;

        /*
          {
            "unofficial": {
              "CONTROL_HIGH_BALL": {
                "official": false,
                "score": 53,
                "exercise": "CONTROL_HIGH_BALL",
                "date": "2018-10-02T09:01:00.000Z"
              }
            },
            "official": {
              "AIM": {
                "official": true,
                "score": 10,
                "exercise": "AIM",
                "date": "2018-10-02T07:09:09.000Z"
              },
              "DRIBBLE": {
                "official": true,
                "score": 90,
                "exercise": "DRIBBLE",
                "date": "2018-10-02T09:05:00.000Z"
              }
            }
          }
         */

        this.measurements.push({
          date: formatDate(new Date()),
          exercise: translateExerciseType(ExerciseType.DRIBBLE),
          score: 10,
          official: true
        });

        this.measurements.push({
          date: formatDate(new Date()),
          exercise: translateExerciseType(ExerciseType.AIM),
          score: 15,
          official: true
        });
      },
    }
  };
</script>

<style scoped>
  .scoreTable Label {
    font-size: 12;
  }
</style>