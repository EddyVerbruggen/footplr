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

    <Image row="2" :src="'~/assets/images/badge_' + (showOwnMeasurements ? 'un' : '') + 'official.png'" width="90%" horizontalAlignment="center" verticalAlignment="center"></Image>
    <!-- club logo (for participating clubs), or our logo (for non-participating clubs) -->
    <!--<Image src="~/assets/images/botafogo.png" height="10%" style="margin-bottom: 15.5%; opacity: 0.2" verticalAlignment="bottom"/>-->

    <GridLayout row="2" rows="4*, 4*, *, *, 4*, 4*" columns="2*, 2*, *, 2*" width="90%"
                horizontalAlignment="center" verticalAlignment="center">

      <StackLayout row="1" colSpan="2" verticalAlignment="center">
        <Label :text="score('TOTAL')" class="card-score bold" horizontalAlignment="center" verticalAlignment="center"></Label>
        <Label :text="userWrapper.user.position || 'positie?'" class="card-role" horizontalAlignment="center"></Label>
      </StackLayout>

      <!--<WebImage row="1" col="2" colSpan="2" :src="userWrapper.user.picture" stretch="aspectFill" horizontalAlignment="left" verticalAlignment="top" class="card-photo"></WebImage>-->
      <Img row="1" col="2" colSpan="2" :src="userWrapper.user.picture" stretch="aspectFill" horizontalAlignment="left" verticalAlignment="top" class="card-photo"></Img>

      <Label :text="playerName" class="card-name bold" row="2" colSpan="4" horizontalAlignment="center" verticalAlignment="center"></Label>

      <Label :text="playerAge" class="card-age bold" row="3" colSpan="4" horizontalAlignment="center" verticalAlignment="top"></Label>

      <GridLayout row="4" colSpan="4" rows="*, *, *" columns="2*, 2*, *, 2*" width="100%" horizontalAlignment="center">
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
    </GridLayout>
  </GridLayout>
</template>

<script>
  import {authService, editingUserService, applicationSettingsService} from "~/main";
  import {getAgeYears, getAgeMonths} from "~/utils/date-util";
  import PlayerSelection from "../PlayerSelection";
  import {EventBus} from "~/services/event-bus";
  import {GlobalStore} from "~/services/global-store";

  export default {
    components: {
      PlayerSelection
    },

    created() {
      EventBus.$on("player-selected", stuff => {
        // TODO add a scorecard for the entire team.. ignoring teams for now
        if (stuff.player) {
          this.userWrapper.user = stuff.player;
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
    font-size: 56;
  }

  .card-role {
    font-size: 25;
  }

  .card-photo {
    width: 110;
    height: 110;
    border-radius: 55;
    background-color: rgba(255, 255, 255, 0.3);
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
    font-size: 28;
    padding-right: 6;
    vertical-align: center;
  }

  .card-item-name {
    font-size: 24;
    vertical-align: center;
  }
</style>