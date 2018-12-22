<template>
  <ScrollView>
    <GridLayout rows="auto, auto, auto, auto, auto, auto, auto, auto, auto, auto, auto, auto, auto, auto, auto, auto, auto, auto, auto" columns="*, *" class="m-x-8">

      <GridLayout :row="Math.floor(index / 2)" :col="index % 2" rows="*, auto" class="tile" @tap="showDetails(item.exercise, item.exerciseTranslated)" v-for="(item, index) in exercises">
        <Image rowSpan="2" src="~/assets/images/tile.jpg" width="100%" opacity="0.7" borderRadius="8"/>
        <Label row="0" :text="item.score" class="score bold" v-bind:class="item.getScoreClass()" horizontalAlignment="right"/>
        <Label row="1" class="tile-exercise bold" :text="item.exerciseTranslated" horizontalAlignment="center" verticalAlignment="bottom"/>
      </GridLayout>

    </GridLayout>
  </ScrollView>
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
        exercises: [[]]
      }
    },

    methods: {
      showDetails(exercise, exerciseTranslated) {
        this.$showModal(MeasurementDetails, {
          fullscreen: false,
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
            score: latestMeasurement ? latestMeasurement.score : 0,
            getScoreClass: () => {
              // TODO this is duplicated in the detail screen. Also: some exercises are 'lower is better'
              if (!latestMeasurement || latestMeasurement.score === 0) {
                return 'c-bg-black';
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
  Label {
    color: #fff;
  }

  .score {
    font-size: 12;
    width: 26;
    height: 26;
    text-align: center;
    border-radius: 50%;
    margin-right: 8;
  }

  .tile {
    padding: 8;
    /*border-width: 1px;*/
    /*border-color: #eee;*/
  }

  .tile-exercise {
    font-size: 15;
    margin-bottom: 6;
  }
</style>