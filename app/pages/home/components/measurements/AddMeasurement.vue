<template>
  <Page>
    <GridLayout rows="auto, auto, *, auto, auto" columns="*, *" horizontalAlignment="center" verticalAlignment="top"
                height="100%">

      <GridLayout id="header" colSpan="2" rows="2*, *" class="p-r-20 p-t-70"
                  :class="'background-color-score-' + scoreClass">
        <Label row="0" :text="exerciseTranslated" color="#fff" class="bold exercise" width="65%" textWrap="true"
               style="text-align: right" horizontalAlignment="right" verticalAlignment="bottom"></Label>
        <Button row="1" text="UITLEG" class="btn btn-secondary btn-explanation" width="140" @tap="doShowExplanation()"
                horizontalAlignment="right" v-if="!showExplanation"></Button>
        <Label row="1" color="#fff" class="c-white m-30 p-t-70"
               text="Uitleg hier, neem wat bier.. of doe maar niet, omdat je dan scheef schiet. Uitleg hier, neem wat bier.. of doe maar niet, omdat je dan scheef schiet. Uitleg hier, neem wat bier.. of doe maar niet, omdat je dan scheef schiet."
               textWrap="true" verticalAlignment="top" v-if="showExplanation"></Label>
      </GridLayout>

      <Image rowSpan="4" :src="'~/assets/images/exercises/' + exercise + '.png'" height="170" horizontalAlignment="left"
             verticalAlignment="top"></Image>

      <!-- TODO add timer/stopwatch here, instead of in the component.. better for reuse -->

      <AddMeasurementForExercise :exercise="exercise" :player="authUser" row="2" colSpan="2" class="m-20" v-if="!showExplanation && !isTeam"></AddMeasurementForExercise>

      <GridLayout row="2" colSpan="2" class="m-20" :rows="nrOfPlayers" columns="auto, auto, *" v-if="!showExplanation && isTeam">
        <WebImage :row="i" col="0" :src="player.picture" stretch="aspectFill" horizontalAlignment="left" class="card-photo" v-for="(player, i) in players"></WebImage>

        <StackLayout :row="i" col="1" verticalAlignment="center" v-for="(player, i) in players">
          <Label :text="player.firstname" class="bold firstname"></Label>
          <Label :text="player.lastname"></Label>
        </StackLayout>

        <AddMeasurementForExercise :exercise="exercise" :player="player" :row="i" col="2" class="m-20" verticalAlignment="center" horizontalAlignment="right" v-for="(player, i) in players"></AddMeasurementForExercise>
      </GridLayout>

      <DatePicker row="3" colSpan="2" height="130" v-model="date" :maxDate="maxDate"
                  v-if="!showExplanation"></DatePicker>

      <Button row="4" col="0" text="ANNULEREN" class="btn btn-secondary" @tap="$modal.close(false)"
              v-if="!showExplanation"></Button>
      <Button row="4" col="1" text="OPSLAAN" class="btn btn-primary" @tap="saveScore()"
              v-if="!showExplanation"></Button>
      <Button row="4" col="1" text="TERUG" class="btn btn-secondary-colorless" :class="'color-score-' + scoreClass"
              @tap="showExplanation = false" v-if="showExplanation"></Button>
    </GridLayout>
  </Page>
</template>

<script>
  import {authService, editingUserService} from "~/main";
  import {formatDate} from "~/utils/date-util";
  import {Excercises, translateExerciseType} from "~/shared/exercises";
  import {EventBus} from "~/services/event-bus";
  import {getPlayersInTeam} from "~/services/TeamService"
  import AddMeasurementForExercise from "./measurement-entry/AddMeasurementForExercise";

  export default {
    components: {
      AddMeasurementForExercise
    },

    created() {
      EventBus.$on("score-entered", data => {
        // remember the data for saving
        this.playerMeasurements.set(data.player, data.measurement);

        // calculate the (average) scoreClass so we can update the header color
        let totalScore = 0;
        this.playerMeasurements.forEach((value, key) => {
          totalScore += Excercises[this.exercise].calculateScore(value);
        });
        this.scoreClass = (Math.ceil(totalScore / this.playerMeasurements.size / 10)) * 10;
      });
    },

    // these have been passed to the modal and can be accessed as this.<property>
    props: ['exercise', 'exerciseTranslated', 'previousScore'],

    async mounted() {
      this.scoreClass = (Math.ceil(this.score / 10)) * 10;

      if (this.isTeam) {
        this.players = await getPlayersInTeam(editingUserService.userWrapper.teamRef);
      }
    },

    data() {
      return {
        authUser: authService.userWrapper.user,
        isTrainer: authService.userWrapper.user.trains !== undefined,
        isSelf: !editingUserService.userWrapper.teamRef && editingUserService.userWrapper.user.id === authService.userWrapper.user.id,
        isTeam: !!editingUserService.userWrapper.teamRef,
        date: new Date(),
        maxDate: new Date(),
        playerMeasurements: new Map(),
        score: this.previousScore || 50, // this is calculated based on the score
        scoreClass: this.scoreClass, // this is updated in mounted()
        showExplanation: false,
        players: undefined,
      }
    },

    computed: {
      nrOfPlayers: function () {
        if (this.players) {
          const rowsStr = Array(this.players.length + 1).join("auto,");
          return rowsStr.substring(0, rowsStr.length - 1);
        }
      }
    },

    methods: {
      doShowExplanation() {
        this.showExplanation = true;
      },

      saveScore() {
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
  }

  Button.btn-explanation {
    border-width: 2;
    border-color: #fff;
    color: #fff;
    margin: 24 0 24 16;
  }

  .card-photo {
    width: 50;
    height: 50;
    border-radius: 25;
    background-color: rgba(255, 255, 255, 0.3);
    margin: 10 20 10 0;
  }

  .firstname {
    font-size: 20;
  }
</style>
