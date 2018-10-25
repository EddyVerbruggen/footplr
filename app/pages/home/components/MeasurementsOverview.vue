<template>
  <GridLayout rows="auto, *" verticalAlignment="top" height="100%">

    <!-- TODO for trainer/admin <Label row="0" text="Voor trainers: filter op speler"/>-->

    <GridLayout row="0" columns="50, 4*, 2*, 2*" class="scoreTable" style="background-color: #CBE3F0">
      <Label col="0" text="Score" class="m-l-10 p-y-10 bold" horizontalAlignment="center"/>
      <Label col="1" text="Oefening" class="p-y-10 p-x-5 bold" @tap="filterExercise"/>
      <Label col="2" text="Datum" class=" p-y-10 p-x-5 bold"/>
    </GridLayout>

    <ListView row="1" for="(item, index) in exercises" separatorColor="transparent" class="scoreTable">
      <v-template>
        <GridLayout columns="50, 4*, 2*, 2*" class="row" v-bind:class="index % 2 === 0 ? 'row-odd' : 'row-even'">
          <Label col="0" :text="item.score" v-bind:class="item.getScoreClass()" class="m-l-10 m-y-4 p-y-5 p-x-5 score" horizontalAlignment="center"/>
          <Label col="1" :text="item.exerciseTranslated" class="p-y-10 p-x-5"/>
          <Label col="2" :text="item.latestMeasurementDate" class="p-y-10 p-x-5"/>
          <StackLayout col="3" class="p-x-5 m-r-10" orientation="horizontal" horizontalAlignment="right">
            <Button text="?" class="show-details" @tap="goToGraph(item.exercise, item.exerciseTranslated)" v-if="item.hasMeasurement"/>
            <Button text="+" class="add-measurement" @tap="addMeasurement(item.exercise, item.exerciseTranslated)"/>
          </StackLayout>
        </GridLayout>
      </v-template>
    </ListView>
  </GridLayout>
</template>

<script>
  import MeasurementDetails from "./MeasurementDetails.vue"
  import {authService} from "~/main";
  import {formatDate} from "~/utils/date-util";
  import {Excercises, Exercise, ExerciseType, translateExerciseType} from "~/shared/exercises";

  export default {
    components: {
      MeasurementDetails
    },

    created() {
      console.log("MeasurementsOverview created");
      // authService.anyPageCallback = () => this.fetchMeasurements(this.exercise);
      this.fetchMeasurements();
    },

    data() {
      return {
        player: undefined,
        exercises: []
      }
    },

    methods: {
      goToGraph(exercise, exerciseTranslated) {
        console.log("goToGraph for exercise: " + exercise);
        // this.$parent.exercise = exercise;
        // this.$parent.selectedListOrGraphIndex = 1;
        // this.$navigateTo(routes.login, {clearHistory: true});
        this.$showModal(MeasurementDetails, {
          fullscreen: true,
          props: {
            exercise,
            exerciseTranslated
          }
        }).then(data => console.log(`Returned from modal: ${data}`));
      },

      addMeasurement(exercise, exerciseTranslated) {
        console.log("addMeasurement for exercise: " + exercise);
        // this.$parent.exercise = exercise;
        // this.$parent.selectedListOrGraphIndex = 1;
        // this.$navigateTo(routes.login, {clearHistory: true});
      },

      fetchMeasurements() {
        const latestMeasurements = authService.userWrapper.user.latestmeasurements;
        const official = true;

        for (let excercisesKey in Excercises) {
          let latestMeasurement;
          if (latestMeasurements[official ? "official" : "unofficial"]) {
            latestMeasurement = latestMeasurements[official ? "official" : "unofficial"][excercisesKey];
          }

          this.exercises.push({
            hasMeasurement: latestMeasurement !== undefined,
            latestMeasurementDate: latestMeasurement ? formatDate(new Date(latestMeasurement.date)) : "-",
            exercise: excercisesKey,
            exerciseTranslated: translateExerciseType(excercisesKey),
            score: latestMeasurement ? latestMeasurement.score : undefined,
            getScoreClass: () => {
              if (!latestMeasurement) {
                return ''
              } else if (latestMeasurement.score > 80) {
                return 'c-bg-purple';
              } else if (latestMeasurement.score > 60) {
                return 'c-bg-blue';
              } else if (latestMeasurement.score > 40) {
                return 'c-bg-orange';
              } else {
                return 'c-bg-ruby';
              }
            }
          });
        }
      },
    }
  };
</script>

<style scoped>
  .scoreTable Label {
    font-size: 12;
  }

  .scoreTable .score {
    color: #fff;
    width: 26;
    text-align: center;
    border-radius: 3;
  }

  .scoreTable .row {
    padding: 5 0;
  }

  .scoreTable .row-odd {
    background-color: #f7f7f7;
  }

  .scoreTable .row-even {
    background-color: #fafafa;
  }

  .scoreTable Button {
    width: 24;
    height: 24;
    border-radius: 50%;
  }

  .scoreTable .show-details {
    background-color: #e6e6e6;
  }

  .scoreTable .add-measurement {
    background-color: #b6b6b6;
    color: #fff;
    margin-left: 8;
    font-size: 20;
  }
</style>