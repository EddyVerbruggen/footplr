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
          <GridLayout rows="2*, *" columns="54, 40, *, 48, 48" class="row" height="68"
                      v-bind:class="'background-color-score-' + item.scoreClass">
            <Label rowSpan="2" col="0" :text="item.score" v-bind:class="'color-score-' + item.scoreClass"
                   class="score icon-round bold"
                   horizontalAlignment="center" verticalAlignment="center"
                   v-show="!item.saving && item.hasMeasurement"></Label>
            <ActivityIndicator :busy="item.saving" rowSpan="2" col="0" width="24" v-show="item.saving"></ActivityIndicator>
            <Img rowSpan="2" col="1" :src="'~/assets/images/exercises/' + item.exercise + '.png'"></Img>
            <Label row="0" col="2" :text="item.exerciseTranslated" class="exercise bold" textWrap="true"
                   verticalAlignment="center"></Label>
            <StackLayout row="1" col="2" orientation="horizontal">
              <Label row="1" col="2" :text="cat" class="exercise-category" textWrap="true"
                     v-bind:class="'color-score-' + item.scoreClass"
                     verticalAlignment="top" v-for="cat in item.categories"></Label>
            </StackLayout>
            <Label rowSpan="2" col="3" class="icon-round" src="~/assets/images/stats.png" horizontalAlignment="center"
                   @tap="showDetails(item)" v-show="item.hasMeasurement && player"></Label>
            <Img rowSpan="2" col="3" color="white" width="14" height="14" src="~/assets/images/stats.png"
                 horizontalAlignment="center" @tap="showDetails(item)" v-show="item.hasMeasurement && player"></Img>
            <Button rowSpan="2" col="4" text="+" class="add-measurement" horizontalAlignment="center"
                    @tap="addMeasurement(item)"></Button>
          </GridLayout>
          <Label row="1" :text="item.hasMeasurement ? 'Laatste test ' + item.latestMeasurementDate : ' '"
                 class="latest-measurement-date" horizontalAlignment="right"></Label>
        </GridLayout>
      </v-template>
    </ListView>
  </GridLayout>
</template>

<script lang="ts">
  import { authService, editingUserService } from "~/main";
  import { EventBus } from "~/services/event-bus";
  import { getPlayersInTeam } from "~/services/TeamService"
  import { Excercises, translateExerciseType } from "~/shared/exercises";
  import { formatDate } from "~/utils/date-util";
  import PlayerSelection from "../PlayerSelection";
  import AddMeasurement from "./AddMeasurement.vue"
  import MeasurementDetails from "./MeasurementDetails.vue"

  export default {
    components: {
      AddMeasurement,
      MeasurementDetails,
      PlayerSelection
    },

    created() {
      // TODO we need to clean this up upon logout, or when entering/leaving the tab
      EventBus.$on("player-selected", stuff => this.playerSelected(stuff));

      editingUserService.anyPageCallback = () => {
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
          console.log(`Returned from modal, added? ${added} for exercise ${item.exercise}`);
          this.isModalOpen = false;
          if (added) {
            item.saving = true;
            item.hasMeasurement = false;
            // there's no current trigger to detect changes, so let's be silly and update after a timeout
            if (!this.player) {
              setTimeout(() => {
                this.fetchTeamMeasurements();
              }, 2000);
            }
          }
        });
      },

      fetchTeamMeasurements() {
        getPlayersInTeam(editingUserService.userWrapper.team.ref)
            .then(users => {
              this.players = users;

              const meas = {};
              // (un)official doesn't matter as this gets combined anyway
              const sumMeasurements = {
                unofficial: meas
              };

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

        // determine the age group, so we can filter the measurement list
        const ageGroup = editingUserService.userWrapper.team ?
            editingUserService.userWrapper.team.agegroup :
            editingUserService.userWrapper.user.playsinTeam ?
                editingUserService.userWrapper.user.playsinTeam.agegroup :
                undefined;

        for (const excercisesKey in Excercises) {
          const exercise = Excercises[excercisesKey];
          if (!exercise.isAvailableForAgeGroup(ageGroup)) {
            continue;
          }

          const latestMeasurement = this.getLatestMeasurementForExercise(latestMeasurements, excercisesKey);
          ex.push({
            hasMeasurement: latestMeasurement !== undefined,
            latestMeasurement: latestMeasurement ? latestMeasurement.measurement : undefined,
            latestMeasurementDate: latestMeasurement ? formatDate(new Date(latestMeasurement.date)) : "",
            exercise: excercisesKey,
            exerciseTranslated: translateExerciseType(excercisesKey),
            categories: exercise.categories,
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
    font-size: 13;
    text-transform: uppercase;
    color: #fff;
    margin: 0 4 0 10;
  }

  .table .exercise-category {
    font-size: 11;
    margin-left: 10;
    padding: 3 6;
    background-color: #ffffff;
    border-radius: 3;
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
