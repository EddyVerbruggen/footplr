<template>
  <GridLayout rows="auto, auto, *" class="m-b-30" columns="*">

    <PlayerSelection v-if="isTrainer"></PlayerSelection>

    <StackLayout row="1" verticalAlignment="top" v-if="isSelf">
      <Label text="football player ratings" class="page-title" horizontalAlignment="center" v-if="!isTrainer"></Label>
      <GridLayout columns="auto, auto" class="m-t-10" horizontalAlignment="center">
        <Switch v-model="showOwnMeasurements"></Switch>
        <Label col="1" text="toon ook eigen metingen" class="p-10" @tap="toggleShowOwnMeasurements"></Label>
      </GridLayout>
    </StackLayout>

    <GridLayout row="2" rows="35*, 7*, 4*, 16*, 16*" columns="19*, 64*" horizontalAlignment="center" verticalAlignment="center" width="90%">
      <Image rowSpan="5" colSpan="2" :src="'~/assets/images/badge_' + (showOwnMeasurements ? 'un' : '') + 'official.png'" width="100%" horizontalAlignment="center" verticalAlignment="center"></Image>

      <!-- uncomment these for a few "debugging lines" -->
<!--      <StackLayout row="0" colSpan="2" backgroundColor="rgba(0, 0, 100, 0.2)"></StackLayout>-->
<!--      <StackLayout row="1" colSpan="2" backgroundColor="rgba(200, 50, 50, 0.2)"></StackLayout>-->
<!--      <StackLayout row="2" colSpan="2" backgroundColor="rgba(0, 100, 100, 0.2)"></StackLayout>-->
<!--      <StackLayout row="3" colSpan="2" backgroundColor="rgba(150, 150, 0, 0.2)"></StackLayout>-->
<!--      <StackLayout row="4" colSpan="2" backgroundColor="rgba(50, 50, 50, 0.2)"></StackLayout>-->

      <StackLayout row="0" col="0" verticalAlignment="bottom">
        <Label :text="score('TOTAL')" class="card-score bold" horizontalAlignment="center" verticalAlignment="center"></Label>
        <Label :text="player.position || 'positie?'" class="card-role" horizontalAlignment="center"></Label>
      </StackLayout>

      <!--<WebImage row="1" col="2" colSpan="2" :src="player.picture" stretch="aspectFill" horizontalAlignment="left" verticalAlignment="top" class="card-photo"></WebImage>-->
      <Img row="0" col="1" :src="player.picture" stretch="aspectFill" horizontalAlignment="center" verticalAlignment="bottom" class="card-photo"></Img>

      <Img row="1" rowSpan="2" col="0" :src="club.logo" verticalAlignment="center" class="m-8" v-if="club.logo"></Img>

      <Label row="1" col="1" :text="playerName" class="card-name bold" horizontalAlignment="center" verticalAlignment="bottom"></Label>

      <Label row="2" col="1" :text="playerAge" class="card-age bold" horizontalAlignment="center" verticalAlignment="top"></Label>

      <GridLayout row="3" col="1" rows="*, *, *" columns="2*, 2*, *, 2*" class="m-t-10" horizontalAlignment="center">
        <Label row="0" col="0" :text="score('PAC')" class="card-item-score bold" horizontalAlignment="right"></Label>
        <Label row="0" col="1" text="PAC" class="card-item-name" horizontalAlignment="left"></Label>
        <Label row="0" col="2" :text="score('DRI')" class="card-item-score bold" horizontalAlignment="right"></Label>
        <Label row="0" col="3" text="DRI" class="card-item-name" horizontalAlignment="left"></Label>

        <Label row="1" col="0" :text="score('SHO')" class="card-item-score bold" horizontalAlignment="right"></Label>
        <Label row="1" col="1" text="SHO" class="card-item-name" horizontalAlignment="left"></Label>
        <Label row="1" col="2" :text="score('TEC')" class="card-item-score bold" horizontalAlignment="right"></Label>
        <Label row="1" col="3" text="TEC" class="card-item-name" horizontalAlignment="left"></Label>

        <Label row="2" col="0" :text="score('PAS')" class="card-item-score bold" horizontalAlignment="right"></Label>
        <Label row="2" col="1" text="PAS" class="card-item-name" horizontalAlignment="left"></Label>
        <Label row="2" col="2" :text="score('PHY')" class="card-item-score bold" horizontalAlignment="right"></Label>
        <Label row="2" col="3" text="PHY" class="card-item-name" horizontalAlignment="left"></Label>
      </GridLayout>

      <!-- TODO -->
      <Label row="4" colSpan="2" :text="showOwnMeasurements ? 'practice' : 'official'" horizontalAlignment="center" verticalAlignment="center" class="m-b-30"></Label>

    </GridLayout>

<!--    <GridLayout row="2" rows="4*, 4*, *, *, 4*, 4*" columns="2*, 2*, *, 2*" width="90%" horizontalAlignment="center" verticalAlignment="center">-->

    </GridLayout>
<!--  </GridLayout>-->
</template>

<script lang="ts">
  import { applicationSettingsService, authService, editingUserService } from "~/main";
  import { EventBus } from "~/services/event-bus";
  import { getAgeMonths, getAgeYears } from "~/utils/date-util";
  import PlayerSelection from "../PlayerSelection";

  export default {
    components: {
      PlayerSelection
    },

    created() {
      EventBus.$on("player-selected", result => {
        this.player = undefined;
        if (!result.player) {
          this.fetchTeamMeasurements();
        } else {
          this.player = result.player;
          this.fillExerciseScoresWithMeasurements(this.player.latestmeasurements);
        }
      });
    },

    computed: {
      playerName: function () {
        return editingUserService.userWrapper.user.firstname + " " + editingUserService.userWrapper.user.lastname
      },
      teamName: function () {
        return this.userWrapper.user.teamName
      },
      playerAge: function () {
        if (!this.userWrapper.user.birthdate) {
          return "";
        }
        let result = `${getAgeYears(new Date(this.userWrapper.user.birthdate))} jaar`;
        const months = getAgeMonths(new Date(this.userWrapper.user.birthdate));
        if (months > 0) {
          result += ` en ${months} ${months === 1 ? "maand" : "maanden"}`;
        }
        return result;
      }
    },

    data() {
      return {
        player: editingUserService.userWrapper.user,
        // TODO editingUserService.userWrapper.user.playsinTeam.,
        club: {
          logo: "https://firebasestorage.googleapis.com/v0/b/foorball-player-ratings.appspot.com/o/clublogos%2FORbHDMRQTSY4gHz9FMDr.png?alt=media&token=ca747a28-6252-43b8-bcae-950f43c05086"
        },
        isTrainer: authService.userWrapper.user.trains !== undefined,
        isSelf: editingUserService.userWrapper.user.id === authService.userWrapper.user.id,
        // trainers are always official, which also means they can't see non-official measurements by players
        showOwnMeasurements: editingUserService.userWrapper.user.id === authService.userWrapper.user.id && applicationSettingsService.isShowOwnMeasurements(),
        selectedPlayer: "Team gemiddelde", // TODO cleanup
        userWrapper: editingUserService.userWrapper,
        score: type => {
          if (this.$editingUserService.userWrapper.user && this.$editingUserService.userWrapper.user.scores) {
            const score = this.$editingUserService.userWrapper.user.scores[this.showOwnMeasurements ? "combined" : "official"][type];
            return score === 0 ? "-" : score;
          }
        },
      };
    },

    watch: {
      // when the Switch itself is toggled there's no event (on iOS), so can't do this in toggleShowOwnMeasurements
      showOwnMeasurements: function () {
        applicationSettingsService.setShowOwnMeasurements(this.showOwnMeasurements);
      }
    },

    methods: {
      toggleShowOwnMeasurements() {
        this.showOwnMeasurements = !this.showOwnMeasurements;
      }
    }
  };
</script>

<style scoped>
  .card-score {
    font-size: 48;
  }

  .card-role {
    font-size: 25;
    margin-bottom: 20;
  }

  .card-photo {
    width: 160;
    height: 160;
  }

  .card-name {
    color: #4e66df;
    font-size: 25;
    /*text-transform: uppercase;*/
  }

  .card-age {
    font-size: 11;
    text-transform: uppercase;
  }

  .card-item-score {
    font-size: 26;
    padding-right: 5;
    vertical-align: center;
  }

  .card-item-name {
    font-size: 22;
    vertical-align: center;
  }
</style>