<template>
  <GridLayout rows="auto, auto, *" verticalAlignment="top" height="100%">

    <PlayerSelection v-if="isTrainer"></PlayerSelection>

    <!--GridLayout row="1" columns="50, 4*, 2*, 100" class="table">
      <Label col="0" text="Score" class="m-l-10 p-y-10 bold" horizontalAlignment="center"/>
      <Label col="1" text="Oefening" class="p-y-10 p-x-5 bold"/>
      <Label col="2" text="Overzicht" class=" p-y-10 p-x-5 bold"/>
    </GridLayout-->

    <ListView row="2" for="(item, index) in exercises" separatorColor="transparent" class="table"
              @itemLoading="onListViewLoading">
      <v-template>
        <GridLayout rows="auto, auto">
          <GridLayout rows="70" columns="2*, 2*, 7*, 2*, 2*" class="row"
                      v-bind:class="'background-color-score-' + item.scoreClass">
            <Label col="0" :text="item.score" v-bind:class="'color-score-' + item.scoreClass" class="score icon-round bold"
                   horizontalAlignment="center" verticalAlignment="center"
                   v-show="item.hasMeasurement"></Label>
            <Img col="1" :src="'~/assets/images/exercises/' + item.exercise + '.png'"></Img>
            <Label col="2" :text="item.exerciseTranslated" class="exercise bold" textWrap="true"
                   verticalAlignment="center"></Label>
            <Label col="3" class="icon-round" src="~/assets/images/stats.png" horizontalAlignment="center"
                   @tap="showDetails(item)" v-show="item.hasMeasurement"></Label>
            <Img col="3" color="white" width="14" height="14" src="~/assets/images/stats.png"
                 horizontalAlignment="center" @tap="showDetails(item)" v-show="item.hasMeasurement"></Img>
            <Button col="4" text="+" class="add-measurement" horizontalAlignment="center"
                    @tap="addMeasurement(item)"></Button>
          </GridLayout>
          <Label row="1" :text="item.hasMeasurement ? 'Laatste test ' + item.latestMeasurementDate : ' '" class="latest-measurement-date" horizontalAlignment="right"></Label>
        </GridLayout>
      </v-template>
    </ListView>
  </GridLayout>
</template>

<script>
  import AddMeasurement from "./AddMeasurement.vue"
  import MeasurementDetails from "./MeasurementDetails.vue"
  import {getPlayersInTeam} from "~/services/TeamService"
  import {authService, editingUserService} from "~/main";
  import {formatDate} from "~/utils/date-util";
  import {Excercises, Exercise, ExerciseType, translateExerciseType} from "~/shared/exercises";
  import PlayerSelection from "../PlayerSelection";
  import {EventBus} from "~/services/event-bus";
  import {GlobalStore} from "~/services/global-store";

  export default {
    components: {
      AddMeasurement,
      MeasurementDetails,
      PlayerSelection
    },

    created() {
      // TODO we need to clean this up upon logout, or when entering/leaving the tab
      EventBus.$on("player-selected", stuff => this.playerSelected(stuff));

      editingUserService.anyPageCallback = user => {
        console.log(">> measurements, anyPageCallback");
        this.fillExerciseScoresWithMeasurements(editingUserService.userWrapper.user.latestmeasurements);
      };

      // if (authService.userWrapper.user.trains !== undefined) {
      //   this.fetchTeamMeasurements();
      // } else {
        this.fillExerciseScoresWithMeasurements(editingUserService.userWrapper.user.latestmeasurements);
      // }

      // for quick dev of the 'add' or 'details' page
      // setTimeout(() => this.addMeasurement({
      //   exercise: ExerciseType.PUSH_UPS,
      //   hasMeasurement: true,
      //   scoreClass: 60,
      //   exerciseTranslated: translateExerciseType(ExerciseType.PUSH_UPS)
      // }), 500);
    },

    data() {
      return {
        isTrainer: authService.userWrapper.user.trains !== undefined,
        player: editingUserService.userWrapper.user,
        players: [],
        exercises: [],
        isModalOpen: false
      }
    },

    methods: {
      onListViewLoading(args) {
        if (args.ios) {
          args.ios.selectionStyle = UITableViewCellSelectionStyle.None;
        }
      },

      playerSelected(result) {
        this.player = undefined;
        if (!result.player) {
          this.fetchTeamMeasurements();
        } else {
          this.player = result.player;
          this.fillExerciseScoresWithMeasurements(this.player.latestmeasurements);
        }
      },

      showDetails(item) {
        if (this.isModalOpen || !item.hasMeasurement) {
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
          this.isModalOpen = false;
        });
      },

      addMeasurement(item) {
        if (this.isModalOpen) {
          return;
        }
        this.$showModal(AddMeasurement, {
          fullscreen: true,
          props: {
            exercise: item.exercise,
            exerciseTranslated: item.exerciseTranslated,
            previousScore: item.score,
            previousMeasurement: item.latestMeasurement,
            editingUser: this.player
          }
        }).then(added => {
          console.log(`Returned from modal, added? ${added}`);
          this.isModalOpen = false;
        });
      },

      fetchTeamMeasurements() {
        getPlayersInTeam(editingUserService.userWrapper.team.ref)
            .then(users => {
              this.players = users;

              const sumMeasurements = {}; // Array<{ [t in ExerciseType]: Measurement }>
              const meas = {};
              // (un)official doesn't matter as this gets combined anyway
              sumMeasurements.unofficial = meas;

              for (let excercisesKey in Excercises) {
                let totalScore = 0;
                let totalUsersWithScore = 0;
                let date = undefined;
                users.forEach(user => {
                  const latestMeas = this.getLatestMeasurementForExercise(user.latestmeasurements, excercisesKey);
                  if (latestMeas) {
                    if (!date || latestMeas.date.getTime() > date.getTime()) {
                      date = latestMeas.date;
                    }
                    totalUsersWithScore++;
                    totalScore += latestMeas.score;
                  }
                });

                if (totalUsersWithScore > 0) {
                  meas[excercisesKey] = {
                    date: date,
                    score: Math.round(totalScore / totalUsersWithScore)
                  }
                }
              }

              this.fillExerciseScoresWithMeasurements(sumMeasurements);
            });
      },

      fillExerciseScoresWithMeasurements(latestMeasurements) {
        const ex = [];

        for (let excercisesKey in Excercises) {
          const latestMeasurement = this.getLatestMeasurementForExercise(latestMeasurements, excercisesKey);
          ex.push({
            hasMeasurement: latestMeasurement !== undefined,
            latestMeasurement: latestMeasurement ? latestMeasurement.measurement : undefined,
            latestMeasurementDate: latestMeasurement ? formatDate(new Date(latestMeasurement.date)) : "",
            exercise: excercisesKey,
            exerciseTranslated: translateExerciseType(excercisesKey),
            score: latestMeasurement ? latestMeasurement.score : undefined,
            scoreClass: latestMeasurement ? (Math.ceil(latestMeasurement.score / 10)) * 10 : undefined
          });
        }
        this.exercises = ex;
      },

      getLatestMeasurementForExercise(latestMeasurements, excercisesKey) {
        let latestMeasurement;
        if (latestMeasurements) {
          if (latestMeasurements.official) {
            latestMeasurement = latestMeasurements.official[excercisesKey];
          }
          if (latestMeasurements.unofficial && latestMeasurements.unofficial[excercisesKey] && (!latestMeasurement || (latestMeasurement.date.getTime && latestMeasurement.date.getTime() < latestMeasurements.unofficial[excercisesKey].date.getTime()))) {
            latestMeasurement = latestMeasurements.unofficial[excercisesKey];
          }
        }
        return latestMeasurement;
      }
    }
  };
</script>

<style scoped>
  .table .row {
    margin: 12 0 2 0;
  }

  .table Label {
    font-size: 12;
  }

  .table .score {
    font-size: 18;
    text-align: center;
  }

  .platform-android .table .score {
    padding-top: 5;
  }

  .table .exercise {
    font-size: 14;
    text-transform: uppercase;
    color: #fff;
    margin: 0 10;
  }

  .table .add-measurement {
    background-color: #20284d;
    color: #ffffff;
    font-size: 25;
    font-weight: bold;
    padding: 2;
    margin: 0
  }

  .platform-android .table .add-measurement {
    padding-top: 0;
  }

  .table .latest-measurement-date {
    font-size: 9;
    margin-right: 10;
  }
</style>
