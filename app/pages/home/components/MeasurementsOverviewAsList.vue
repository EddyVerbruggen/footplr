<template>
  <GridLayout rows="auto, auto, *" verticalAlignment="top" height="100%">

    <Label row="0" :text="selectedPlayer" class="m-b-10 p-8 c-bg-lime c-white" horizontalAlignment="center" @tap="selectPlayer" v-if="isTrainer"></Label>

    <!--GridLayout row="1" columns="50, 4*, 2*, 100" class="table">
      <Label col="0" text="Score" class="m-l-10 p-y-10 bold" horizontalAlignment="center"/>
      <Label col="1" text="Oefening" class="p-y-10 p-x-5 bold"/>
      <Label col="2" text="Overzicht" class=" p-y-10 p-x-5 bold"/>
    </GridLayout-->

    <ListView row="2" for="(item, index) in exercises" separatorColor="transparent" class="table" @itemLoading="onListViewLoading">
      <v-template>
        <GridLayout rows="auto, auto">
          <GridLayout columns="2*, 2*, 7*, 2*, 2*" class="row" v-bind:class="'background-score-' + item.scoreClass">
            <Label col="0" :text="item.score" class="score bold" horizontalAlignment="center"></Label>
            <Img col="1" src="~/assets/images/exercises/aanname-hoge-bal.png"></Img>
            <Label col="2" :text="item.exerciseTranslated" class="exercise bold" textWrap="true"></Label>
            <Button col="3" text="📊" class="show-details" horizontalAlignment="center" @tap="showDetails(item)" :opacity="item.hasMeasurement ? 1 : 0"></Button>
            <Button col="4" text="+" class="add-measurement" horizontalAlignment="center" @tap="addMeasurement(item)"></Button>
          </GridLayout>
          <Label row="1" :text="'Laatste test ' + item.latestMeasurementDate" class="latest-measurement-date" horizontalAlignment="right" :opacity="item.hasMeasurement ? 1 : 0"></Label>
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
      setTimeout(() => this.showDetails({
        exercise: ExerciseType.DRIBBLE,
        hasMeasurement: true,
        scoreClass: 60,
        exerciseTranslated: translateExerciseType(ExerciseType.DRIBBLE)
      }), 500);
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
      onListViewLoading(args) {
        if (args.ios) {
          args.ios.selectionStyle = UITableViewCellSelectionStyle.None;
        }
      },
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
            exerciseTranslated: item.exerciseTranslated,
            scoreClass: item.scoreClass
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
            scoreClass: latestMeasurement ? (Math.ceil(latestMeasurement.score / 10)) * 10 : 50
          });
        }
        this.exercises = ex;
      },
    }
  };
</script>

<style scoped>
  .table .row {
    padding: 12 0;
    margin: 12 0 2 0;
  }

  .table Label {
    font-size: 12;
  }

  .table .score {
    font-size: 22;
    color: #f9d78f;
    text-align: center;
  }

  .table .exercise {
    font-size: 14;
    text-transform: uppercase;
    color: #fff;
    margin: 0 10;
  }

  .table .show-details {
    color: #fff;
    font-size: 16;
  }

  .table .add-measurement {
    background-color: #20284d;
    color: #fff;
    font-size: 22;
  }

  .table .latest-measurement-date {
    font-size: 9;
    margin-right: 10;
  }
</style>
