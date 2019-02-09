<template>
  <Page @loaded="pageLoaded">
    <GridLayout id="addView" @loaded="onViewLoaded" rows="auto, auto, auto, *, auto" columns="*, *"
                horizontalAlignment="center" verticalAlignment="top" style="margin-bottom: 200" height="100%">

      <GridLayout id="header" colSpan="2" rows="2*, *" columns="auto, *" class="p-r-20 p-t-20"
                  :class="'background-color-score-' + scoreClass">
        <Image :src="'~/assets/images/exercises/' + exercise + '.png'" height="70" class="m-l-12 m-t-12"
               horizontalAlignment="left" verticalAlignment="top"></Image>
        <Label col="1" :text="exerciseTranslated" class="bold exercise" width="70%" textWrap="true"
               style="text-align: right" horizontalAlignment="right" verticalAlignment="bottom"></Label>
        <Label row="1" :text="(isTeam ? 'Team gemiddelde: ' : 'Vorige meting: ') + previousMeasurement"
               class="previous-score bold" verticalAlignment="bottom"
               v-show="!showExplanation && previousMeasurement"></Label>
        <Button row="1" col="1" text="UITLEG" class="btn btn-secondary btn-explanation" width="140"
                @tap="toggleShowExplanation()"
                horizontalAlignment="right" v-show="!showExplanation"></Button>
        <Label row="1" colSpan="2" class="c-white m-30 p-t-10" textWrap="true" verticalAlignment="top"
               text="Uitleg hier, neem wat bier.. of doe maar niet, omdat je dan scheef schiet. Uitleg hier, neem wat bier.. of doe maar niet, omdat je dan scheef schiet. Uitleg hier, neem wat bier.. of doe maar niet, omdat je dan scheef schiet."
               v-show="showExplanation"></Label>
      </GridLayout>

      <Timer row="2" colSpan="2" :duration="timerDuration()" label="Start meting" :hint="timerHint()" class="m-t-10"
             v-show="showTimer"></Timer>

      <AddMeasurementForExercise :exercise="exercise" :player="editingUser" row="3" colSpan="2" class="m-r-12"
                                 v-show="!showExplanation && !isTeam"></AddMeasurementForExercise>

      <ScrollView row="3" colSpan="2" v-show="!showExplanation && isTeam">
        <GridLayout class="player-row" :rows="nrOfPlayers" columns="auto, auto, *">
          <Img backgroundColor="#e6e6e6" :row="i" col="0" :src="player.picture" stretch="aspectFill"
               horizontalAlignment="left" class="card-photo" v-for="(player, i) in players"></Img>

          <StackLayout :row="i" col="1" verticalAlignment="center" v-for="(player, i) in players">
            <Label :text="player.firstname" class="bold firstname"></Label>
            <Label :text="player.lastname"></Label>
          </StackLayout>

          <AddMeasurementForExercise :exercise="exercise" :player="player" :row="i" col="2"
                                     verticalAlignment="center" horizontalAlignment="right"
                                     v-for="(player, i) in players"></AddMeasurementForExercise>
        </GridLayout>
      </ScrollView>

      <GridLayout row="4" colSpan="2" columns="*, *">
        <Button col="0" text="ANNULEREN" class="btn btn-secondary" @tap="closeModal" v-show="!showExplanation"></Button>
        <Button col="1" text="OPSLAAN" class="btn btn-primary" @tap="saveScore" v-show="!showExplanation"></Button>
        <Button col="1" text="TERUG" class="btn btn-secondary-colorless" :class="'color-score-' + scoreClass"
                @tap="toggleShowExplanation()" v-show="showExplanation"></Button>
      </GridLayout>
    </GridLayout>
  </Page>
</template>

<script lang="ts">
  import { authService, editingUserService } from "~/main";
  import { EventBus } from "~/services/event-bus";
  import { getPlayersInTeam } from "~/services/TeamService"
  import { Excercises } from "~/shared/exercises";
  import { logEvent, setScreenName } from "~/utils/analytics-util";
  import { dismissKeyboard } from "~/utils/keyboard-util";
  import AddMeasurementForExercise from "./measurement-entry/AddMeasurementForExercise";
  import Timer from "./measurement-entry/Timer";

  export default {
    components: {
      AddMeasurementForExercise,
      Timer
    },

    created() {
      EventBus.$on("score-entered", data => {
        // remember the data for saving
        if (data.measurement === "") {
          this.playerMeasurements.delete(data.player);
        } else {
          this.playerMeasurements.set(data.player, data.measurement);
        }

        // calculate the (average) scoreClass so we can update the header color
        if (this.playerMeasurements.size > 0) {
          let totalScore = 0;
          this.playerMeasurements.forEach((value, key) => {
            totalScore += Excercises[this.exercise].calculateScore(value);
          });
          this.scoreClass = (Math.ceil(totalScore / this.playerMeasurements.size / 10)) * 10;
        }
      });
    },

    // these have been passed to the modal and can be accessed as this.<property>
    props: ['exercise', 'exerciseTranslated', 'previousScore', 'previousMeasurement', 'editingUser'],

    async mounted() {
      this.scoreClass = (Math.ceil(this.score / 10)) * 10;

      if (this.isTeam) {
        this.players = await getPlayersInTeam(editingUserService.userWrapper.team.ref);
      }
    },

    data() {
      return {
        isTrainer: authService.userWrapper.user.trains !== undefined,
        isSelf: !editingUserService.userWrapper.team && editingUserService.userWrapper.user.id === authService.userWrapper.user.id,
        isTeam: !!editingUserService.userWrapper.team,
        timerHint: () => {
          if (this.exercise === "HEARTRATE") return "Tel het aantal slagen..";
          else if (this.exercise === "SPEED_OF_ACTION") return "Tel de scores op..";
          else if (this.exercise === "CONTROL_HIGH_BALL") return "Tel de scores op..";
          else return "";
        },
        timerDuration: () => {
          if (this.exercise === "HEARTRATE") return 15;
          else if (this.exercise === "SPEED_OF_ACTION") return 20;
          else if (this.exercise === "CONTROL_HIGH_BALL") return 30;
          else return 0;
        },
        date: new Date(),
        maxDate: new Date(),
        playerMeasurements: new Map(),
        score: this.previousScore || 50, // this is calculated based on the score
        scoreClass: this.scoreClass, // this is updated in mounted()
        showExplanation: false,
        players: undefined
      }
    },

    computed: {
      showTimer: function () {
        return !this.showExplanation &&
            (this.exercise === "HEARTRATE" || this.exercise === "SPEED_OF_ACTION" || this.exercise === "CONTROL_HIGH_BALL")
      },

      nrOfPlayers: function () {
        if (this.players) {
          const rowsStr = Array(this.players.length + 1).join("auto,");
          return rowsStr.substring(0, rowsStr.length - 1);
        }
      }
    },

    methods: {
      pageLoaded() {
        setScreenName(`measurement.add.${this.exercise}`);
      },

      toggleShowExplanation() {
        this.showExplanation = !this.showExplanation;
      },

      closeModal(event) {
        dismissKeyboard(event.object);
        this.$modal.close(false);
      },

      saveScore(event) {
        if (this.playerMeasurements.size === 0) {
          return;
        }

        this.playerMeasurements.forEach((value, player) => {
          if (!player || !player.ref || !player.ref.collection) {
            // may happen during livesync: fix = log out and in
            return;
          }

          // round to max 2 decimals
          const measurement = (Math.round(value * 100)) / 100;

          // round to 0 decimals
          const score = Math.round(Excercises[this.exercise].calculateScore(measurement));

          player
              .ref
              .collection("measurements")
              .add({
                date: this.date,
                measurement,
                score,
                exercise: this.exercise,
                official: this.isTrainer || !this.isSelf,
                measuredby: authService.userWrapper.user.ref
              })
              .then(() => {
                console.log(`measurement ${measurement} (score ${score}) saved for ${player.firstname} ${player.lastname}`);
                logEvent("measurement_added");
              })
              .catch(err => console.log(err));
        });

        // note that this closes the modal before player data has been saved (which is 🆗)
        this.$modal.close(true);
      }
    }
  };
</script>

<style scoped>
  .exercise {
    font-size: 22;
    color: #fff;
  }

  Button.btn-explanation {
    border-width: 2;
    border-color: #fff;
    color: #fff;
    margin: 16 0 16 0;
  }

  .player-row {
    margin: 6 12 0 12;
  }

  .card-photo {
    width: 44;
    height: 44;
    border-radius: 22;
    background-color: rgba(255, 255, 255, 0.3);
    margin: 10 12 10 0;
  }

  .firstname {
    font-size: 20;
  }

  .previous-score {
    font-size: 13;
    color: #fff;
    margin: 0 0 12 12;
  }
</style>
