<template>
  <GridLayout rows="auto, auto, *" verticalAlignment="top" height="100%">

    <Label row="0" :text="selectedPlayer" class="m-b-10 p-8 c-bg-lime c-white" horizontalAlignment="center" @tap="selectPlayer" v-if="isTrainer"/>

    <GridLayout row="1" columns="50, 4*, 2*, 100" class="table" style="background-color: #011627; color: #fff">
      <Label col="0" text="Score" class="m-l-10 p-y-10 bold" horizontalAlignment="center"/>
      <Label col="1" text="Oefening" class="p-y-10 p-x-5 bold"/>
      <Label col="2" text="Datum" class=" p-y-10 p-x-5 bold"/>
    </GridLayout>

    <ListView row="2" for="(item, index) in exercises" separatorColor="transparent" class="table">
      <v-template>
        <GridLayout columns="50, 4*, 2*, 100" class="row" v-bind:class="index % 2 === 0 ? 'row-odd' : 'row-even'">
          <Label col="0" :text="item.score" v-bind:class="item.getScoreClass()" class="m-l-10 m-y-4 p-y-5 p-x-5 score bold" horizontalAlignment="center"/>
          <Label col="1" :text="item.exerciseTranslated" class="p-y-10 p-x-5" v-bind:opacity="item.hasMeasurement ? 1 : 0.5" />
          <Label col="2" :text="item.latestMeasurementDate" class="p-y-10 p-x-5"/>
          <StackLayout col="3" class="p-x-5 m-r-10" orientation="horizontal" horizontalAlignment="right">
            <Button text="🔍" class="show-details" @tap="showDetails(item)" :opacity="item.hasMeasurement ? 1 : 0"/>
            <Button text="+" class="add-measurement" @tap="addMeasurement(item)"/>
          </StackLayout>
        </GridLayout>
      </v-template>
    </ListView>
  </GridLayout>
</template>

<script>
  import {action} from "tns-core-modules/ui/dialogs";
  import AddMeasurement from "./AddMeasurement.vue"
  import MeasurementDetails from "./MeasurementDetails.vue"
  import {getPlayersInTeam} from "../../../services/TeamService"
  import {authService} from "~/main";
  import {formatDate} from "~/utils/date-util";
  import {Excercises, Exercise, ExerciseType, translateExerciseType} from "~/shared/exercises";

  export default {
    components: {
      AddMeasurement,
      MeasurementDetails
    },

    created() {
      authService.anyPageCallback = () => {
        this.fillExerciseScoresWithMeasurements(authService.userWrapper.user.latestmeasurements);
      };

      if (authService.userWrapper.user.trains !== undefined) {
        this.fetchTeamMeasurements();
      } else {
        this.fillExerciseScoresWithMeasurements(authService.userWrapper.user.latestmeasurements);
      }

      // for quick dev of the 'add' page
      // setTimeout(() => this.addMeasurement({
      //   exercise: ExerciseType.DRIBBLE,
      //   exerciseTranslated: translateExerciseType(ExerciseType.DRIBBLE)
      // }), 500);
    },

    data() {
      return {
        official: true, // TODO somewhere more generic
        selectedPlayer: "Team gemiddelde",
        player: authService.userWrapper.user,
        players: [],
        exercises: [],
        // TODO perhaps this component will be trainer-only, in which case we can remove this property
        isTrainer: authService.userWrapper.user.trains !== undefined
      }
    },

    methods: {
      selectPlayer() {
        // TODO for teamavg, consider using a Firebase Function instead of real-time calculation

        const options = this.players.map(player => player.firstname + " " + player.lastname); // ["GK (keeper)", "CM (mid-mid)", "CAM (aanvallende middenvelder)", "CF (mid-voor)"];
        action({
          title: "Kies een speler..",
          actions: ["Team gemiddelde", ...options],
          cancelable: true
        }).then(picked => {
          if (picked) {
            this.player = undefined;
            this.selectedPlayer = picked;
            if (picked === "Team gemiddelde") {
              this.fetchTeamMeasurements();
            } else {
              this.player = this.players[options.indexOf(picked)];
              this.fillExerciseScoresWithMeasurements(this.player.latestmeasurements);
            }
          }
        });
      },

      showDetails(item) {
        if (!item.hasMeasurement) {
          return;
        }
        this.$showModal(MeasurementDetails, {
          fullscreen: true,
          props: {
            exercise: item.exercise,
            exerciseTranslated: item.exerciseTranslated
          }
        }).then(data => {
          console.log(`Returned from showDetails: ${data}`);
        });
      },

      addMeasurement(item) {
        this.$showModal(AddMeasurement, {
          fullscreen: true,
          props: {
            exercise: item.exercise,
            exerciseTranslated: item.exerciseTranslated
          }
        }).then(added => {
          console.log(`Returned from modal, added? ${added}`);
          // refresh will happen via our 'anyPageCallback'
        });
      },

      fetchTeamMeasurements() {
        // TODO may train multiple teams
        getPlayersInTeam(authService.userWrapper.user.trains[0])
            .then(users => {
              this.players = users;

              // TODO official/unofficial
              const sumMeasurements = {}; // Array<{ [t in ExerciseType]: Measurement }>
              const meas = {};
              sumMeasurements[this.official ? "official" : "unofficial"] = meas;

              for (let excercisesKey in Excercises) {
                let totalScore = 0;
                let totalUsersWithScore = 0;
                let date = undefined;
                users.forEach(user => {
                  const latestMeass = user.latestmeasurements[this.official ? "official" : "unofficial"]
                  const latestMeas = latestMeass && latestMeass[excercisesKey] ? latestMeass[excercisesKey] : undefined;
                  if (latestMeas) {
                    if (!date || latestMeas.date.getTime() > date.getTime()) {
                      console.log("latestMeas.date: " + latestMeas.date.getTime());
                      date = latestMeas.date;
                    }
                    totalUsersWithScore++;
                    totalScore += latestMeas.score;
                    console.log("totalScore now: " + totalScore);
                  }
                });

                if (totalUsersWithScore > 0) {
                  meas[excercisesKey] = {
                    date: date,
                    score: Math.round(totalScore / totalUsersWithScore)
                  }
                }
              }

              console.log("sumMeasurements: " + JSON.stringify(sumMeasurements));

              // this.fillExerciseScoresWithMeasurements(users[0].latestmeasurements);
              this.fillExerciseScoresWithMeasurements(sumMeasurements);
            });
      },

      fillExerciseScoresWithMeasurements(latestMeasurements) {
        // this.exercises.splice(0);
        const ex = [];

        for (let excercisesKey in Excercises) {
          let latestMeasurement;
          if (latestMeasurements && latestMeasurements[this.official ? "official" : "unofficial"]) {
            latestMeasurement = latestMeasurements[this.official ? "official" : "unofficial"][excercisesKey];
          }

          ex.push({
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
        this.exercises = ex;
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
