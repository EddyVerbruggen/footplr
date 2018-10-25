<template>
  <GridLayout rows="auto, *" verticalAlignment="top" height="100%">

    <!-- TODO for trainer/admin <Label row="0" text="Voor trainers: filter op speler"/>-->

    <GridLayout row="0" columns="50, 4*, 2*, 100" class="table" style="background-color: #CBE3F0">
      <Label col="0" text="Score" class="m-l-10 p-y-10 bold" horizontalAlignment="center"/>
      <Label col="1" text="Oefening" class="p-y-10 p-x-5 bold" @tap="filterExercise"/>
      <Label col="2" text="Datum" class=" p-y-10 p-x-5 bold"/>
    </GridLayout>

    <ListView row="1" for="(item, index) in exercises" separatorColor="transparent" class="table">
      <v-template>
        <GridLayout columns="50, 4*, 2*, 100" class="row" v-bind:class="index % 2 === 0 ? 'row-odd' : 'row-even'">
          <Label col="0" :text="item.score" v-bind:class="item.getScoreClass()" class="m-l-10 m-y-4 p-y-5 p-x-5 score bold" horizontalAlignment="center"/>
          <Label col="1" :text="item.exerciseTranslated" class="p-y-10 p-x-5" v-bind:opacity="item.hasMeasurement ? 1 : 0.5" />
          <Label col="2" :text="item.latestMeasurementDate" class="p-y-10 p-x-5"/>
          <StackLayout col="3" class="p-x-5 m-r-10" orientation="horizontal" horizontalAlignment="right">
            <Button text="🔍" class="show-details" @tap="showDetails(item.exercise, item.exerciseTranslated)" v-if="item.hasMeasurement"/>
            <Button text="+" class="add-measurement" @tap="addMeasurement(item.exercise, item.exerciseTranslated)"/>
          </StackLayout>
        </GridLayout>
      </v-template>
    </ListView>
  </GridLayout>
</template>

<script>
  import AddMeasurement from "./AddMeasurement.vue"
  import MeasurementDetails from "./MeasurementDetails.vue"
  import {authService} from "~/main";
  import {formatDate} from "~/utils/date-util";
  import {Excercises, Exercise, ExerciseType, translateExerciseType} from "~/shared/exercises";

  export default {
    components: {
      AddMeasurement,
      MeasurementDetails
    },

    created() {
      console.log("MeasurementsOverview created");
      authService.anyPageCallback = () => {
        console.log(">>> anyPageCallback called in overview");
        this.fetchMeasurements();
      };
      this.fetchMeasurements();

      // for quick dev of the 'add' page
      // setTimeout(() => this.addMeasurement(ExerciseType.DRIBBLE, "Dribbelen"), 500);
    },

    data() {
      return {
        player: undefined,
        exercises: []
      }
    },

    methods: {
      showDetails(exercise, exerciseTranslated) {
        this.$showModal(MeasurementDetails, {
          fullscreen: true,
          props: {
            exercise,
            exerciseTranslated
          }
        }).then(data => {
          console.log(`Returned from showDetails: ${data}`);
          setTimeout(() => {
            this.fetchMeasurements();
          }, 5000);
        });
      },

      addMeasurement(exercise, exerciseTranslated) {
        this.$showModal(AddMeasurement, {
          fullscreen: true,
          props: {
            exercise,
            exerciseTranslated
          }
        }).then(added => {
          console.log(`Returned from modal, added? ${added}`);
          if (added) {
            setTimeout(() => {
              this.fetchMeasurements();
            }, 5000);
          }
        });
      },

      fetchMeasurements() {
        this.exercises.splice(0);
        const latestMeasurements = authService.userWrapper.user.latestmeasurements;
        if (latestMeasurements) {
          console.log("latestMeasurements: " + JSON.stringify(latestMeasurements.official));
        }
        const official = true;

        for (let excercisesKey in Excercises) {
          let latestMeasurement;
          if (latestMeasurements && latestMeasurements[official ? "official" : "unofficial"]) {
            latestMeasurement = latestMeasurements[official ? "official" : "unofficial"][excercisesKey];
          }

          this.exercises.push({
            hasMeasurement: latestMeasurement !== undefined,
            latestMeasurementDate: latestMeasurement ? formatDate(new Date(latestMeasurement.date)) : "",
            exercise: excercisesKey,
            exerciseTranslated: translateExerciseType(excercisesKey),
            score: latestMeasurement ? latestMeasurement.score : undefined,
            getScoreClass: () => {
              // TODO this is duplicated in the detail screen. Also: some exercises are 'lower is better'
              if (!latestMeasurement) {
                return 'c-bg-grey-lighter'
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
  .table Label {
    font-size: 12;
  }

  .table .score {
    color: #fff;
    width: 26;
    text-align: center;
    border-radius: 3;
  }

  .table .show-details {
    font-size: 12;
    background-color: #e6e6e6;
  }

  .table .add-measurement {
    background-color: #b6b6b6;
    color: #fff;
    margin-left: 8;
    font-size: 22;
  }
</style>