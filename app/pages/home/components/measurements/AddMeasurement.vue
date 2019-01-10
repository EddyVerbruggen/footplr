<template>
  <Page>
    <GridLayout id="addView" @loaded="onViewLoaded" rows="auto, auto, auto, *, auto" columns="*, *"
                horizontalAlignment="center"
                verticalAlignment="top" style="margin-bottom: 200" height="100%">

      <GridLayout id="header" colSpan="2" rows="2*, *" class="p-r-20 p-t-70"
                  :class="'background-color-score-' + scoreClass">
        <Label row="0" :text="exerciseTranslated" class="bold exercise" width="65%" textWrap="true"
               style="text-align: right" horizontalAlignment="right" verticalAlignment="bottom"></Label>
        <Button row="1" text="UITLEG" class="btn btn-secondary btn-explanation" width="140" @tap="toggleShowExplanation"
                horizontalAlignment="right" v-if="!showExplanation"></Button>
        <Label row="1" :text="(isTeam ? 'Huidig teamgemiddelde: ' : 'Vorige score: ') + previousScore"
               class="previous-score bold" verticalAlignment="bottom" v-if="!showExplanation && previousScore"></Label>
        <Label row="1" class="c-white m-30 p-t-70"
               text="Uitleg hier, neem wat bier.. of doe maar niet, omdat je dan scheef schiet. Uitleg hier, neem wat bier.. of doe maar niet, omdat je dan scheef schiet. Uitleg hier, neem wat bier.. of doe maar niet, omdat je dan scheef schiet."
               textWrap="true" verticalAlignment="top" v-if="showExplanation"></Label>
      </GridLayout>

      <Image rowSpan="4" :src="'~/assets/images/exercises/' + exercise + '.png'" height="150" class="m-l-12 m-t-4"
             horizontalAlignment="left" verticalAlignment="top"></Image>

      <!-- TODO conditionally add timer/stopwatch here, instead of in the component.. better for reuse -->
      <Timer row="2" colSpan="2" duration="15" label="Start meting" :hint="timerHint" class="m-t-10" v-if="showTimer"></Timer>

      <AddMeasurementForExercise :exercise="exercise" :player="editingUser" row="3" colSpan="2" class="m-20"
                                 v-if="!showExplanation && !isTeam"></AddMeasurementForExercise>

      <ScrollView row="3" colSpan="2" v-if="!showExplanation && isTeam">
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

      <GridLayout row="4" colSpan="2" columns="*, *" v-if="!keyboardShowing || !isTeam">
        <Button col="0" text="ANNULEREN" class="btn btn-secondary" @tap="closeModal" v-if="!showExplanation"></Button>
        <Button col="1" text="OPSLAAN" class="btn btn-primary" @tap="saveScore" v-if="!showExplanation"></Button>
        <Button col="1" text="TERUG" class="btn btn-secondary-colorless" :class="'color-score-' + scoreClass"
                @tap="toggleShowExplanation" v-if="showExplanation"></Button>
      </GridLayout>
    </GridLayout>
  </Page>
</template>

<script>
  import {authService, editingUserService} from "~/main";
  import {formatDate} from "~/utils/date-util";
  import {dismissKeyboard} from "~/utils/keyboard-util";
  import {Excercises, translateExerciseType} from "~/shared/exercises";
  import {EventBus} from "~/services/event-bus";
  import {getPlayersInTeam} from "~/services/TeamService"
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

      EventBus.$on("keyboard-showing", showing => {
        this.keyboardShowing = showing;
      });
    },

    // these have been passed to the modal and can be accessed as this.<property>
    props: ['exercise', 'exerciseTranslated', 'previousScore', 'editingUser'],

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
        timerHint: this.exercise === "HEARTRATE" ? "Tel het aantal slagen.." : "",
        date: new Date(),
        maxDate: new Date(),
        playerMeasurements: new Map(),
        score: this.previousScore || 50, // this is calculated based on the score
        scoreClass: this.scoreClass, // this is updated in mounted()
        showExplanation: false,
        players: undefined,
        keyboardShowing: false
      }
    },

    computed: {
      showTimer: function () {
        return !this.showExplanation &&
            this.exercise === "HEARTRATE"
      },

      nrOfPlayers: function () {
        if (this.players) {
          const rowsStr = Array(this.players.length + 1).join("auto,");
          return rowsStr.substring(0, rowsStr.length - 1);
        }
      }
    },

    methods: {
      onViewLoaded(event) {
        // const page = topmost().currentPage;
        // const forView = page.getViewById("addView");

        // TODO also remove this listener.. although it may happen automatically
      },

      toggleShowExplanation() {
        this.showExplanation = !this.showExplanation;
      },

      closeModal(event) {
        dismissKeyboard(event.object);
        this.$modal.close(false);
      },

      saveScore(event) {
        console.log("save, size: " + this.playerMeasurements.size);
        if (this.playerMeasurements.size === 0) {
          return;
        }

        this.playerMeasurements.forEach((value, player) => {
          // round to 2 decimals
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
              .then(() => console.log(`measurement ${measurement} (score ${score}) saved for ${player.firstname} ${player.lastname}`))
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
    margin: 24 0 16 0;
  }

  .player-row {
    margin: 12;
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
