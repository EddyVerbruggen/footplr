<template>
  <GridLayout rows="auto, auto, *" class="m-b-30" columns="*" v-bind:class="'small-screen-' + isSmallScreen + ' landscape-' + isLandscape">

    <PlayerSelection v-if="isTrainer"></PlayerSelection>

    <StackLayout row="1" verticalAlignment="top" v-if="isSelf">
      <Label text="football player ratings" class="page-title" horizontalAlignment="center"
             v-if="!isTrainer || players.length"></Label>
      <GridLayout columns="auto, auto" v-bind:class="isLandscape ? '' : 'm-t-10'" horizontalAlignment="center" v-if="!players.length">
        <Switch v-model="showOwnMeasurements"></Switch>
        <Label col="1" text="toon ook eigen metingen" class="p-10" @tap="toggleShowOwnMeasurements"></Label>
      </GridLayout>
    </StackLayout>

    <GridLayout row="2" rows="63.5*, 14.5*, 9*, 40*, 24*" columns="19*, 64*"
                horizontalAlignment="center" verticalAlignment="center" v-bind:width="isLandscape ? '26%' : '88%'">
      <Img rowSpan="5" colSpan="2"
           :src="'~/assets/images/badge/' + (showOwnMeasurements ? 'unofficial/badge_unofficial' : 'official/badge_official_' + (Math.ceil(score('TOTAL') / 10)) * 10) + '.png'"
           width="100%" horizontalAlignment="center" verticalAlignment="center"></Img>

      <GridLayout row="0" col="1" :rows="getPlayerImageRows()" :columns="getPlayerImageColumns()"
                  horizontalAlignment="center" verticalAlignment="bottom" class="m-x-10" v-if="players.length">
        <Img :row="Math.floor((i + getPlayerImageOffset()) / nrOfPlayerImageCols())"
             :col="Math.ceil((i + getPlayerImageOffset()) % nrOfPlayerImageCols())"
             :src="player.picture || '~/assets/images/placeholder_player.png'" stretch="aspectFill"
             :class="'card-photo-team card-photo-team-' + nrOfPlayerImageCols()"
             :opacity="player.picture ? 1 : 0.7" v-for="(player, i) in players"
             :key="player.id"></Img>
      </GridLayout>

      <Img row="0" col="1" :src="player.picture || '~/assets/images/placeholder_player.png'" stretch="aspectFill"
           horizontalAlignment="center" verticalAlignment="bottom" class="card-photo" v-show="!players.length"></Img>

      <Img rowSpan="5" colSpan="2"
           :src="'~/assets/images/badge/' + (showOwnMeasurements ? 'unofficial/badge_unofficial' : 'official/badge_official_' + (Math.ceil(score('TOTAL') / 10)) * 10) + '_overlay.png'" width="100%"
           horizontalAlignment="center" verticalAlignment="center"></Img>

      <StackLayout row="0" col="0" verticalAlignment="bottom">
        <Label :text="score('TOTAL')" class="card-score bold" horizontalAlignment="center"
               verticalAlignment="center"></Label>
        <Label :text="player.position || 'positie?'" class="card-role" horizontalAlignment="center"
               v-if="!players.length"></Label>
        <Img :src="self.picture || '~/assets/images/placeholder_player.png'" class="card-photo-trainer"
             horizontalAlignment="center" v-if="players.length && isTrainer"></Img>
      </StackLayout>

      <Img row="1" rowSpan="2" col="0" :src="club.logo" verticalAlignment="center" class="m-8" v-if="club && club.logo"></Img>
      <Img row="1" rowSpan="2" col="0" src="~/assets/images/fpr-logo-128.png" verticalAlignment="center" class="m-8" v-if="!club || !club.logo"></Img>

      <Label row="1" col="1" :text="playerName" class="card-name bold" horizontalAlignment="center" verticalAlignment="bottom"></Label>

      <Label row="2" col="1" :text="playerAge" class="card-age bold" horizontalAlignment="center" verticalAlignment="top"></Label>

      <GridLayout row="3" col="1" rows="auto, auto, auto" columns="2*, 2*, *, 2*, 2*" class="m-t-5"
                  horizontalAlignment="center">
        <Label row="0" col="0" :text="score('PAC')" class="card-item-score bold" horizontalAlignment="right"></Label>
        <Label row="0" col="1" text="PAC" class="card-item-name" horizontalAlignment="left"></Label>
        <Label row="0" col="3" :text="score('DRI')" class="card-item-score bold" horizontalAlignment="right"></Label>
        <Label row="0" col="4" text="DRI" class="card-item-name" horizontalAlignment="left"></Label>

        <Label row="1" col="0" :text="score('SHO')" class="card-item-score bold" horizontalAlignment="right"></Label>
        <Label row="1" col="1" text="SHO" class="card-item-name" horizontalAlignment="left"></Label>
        <Label row="1" col="3" :text="score('TEC')" class="card-item-score bold" horizontalAlignment="right"></Label>
        <Label row="1" col="4" text="TEC" class="card-item-name" horizontalAlignment="left"></Label>

        <Label row="2" col="0" :text="score('PAS')" class="card-item-score bold" horizontalAlignment="right"></Label>
        <Label row="2" col="1" text="PAS" class="card-item-name" horizontalAlignment="left"></Label>
        <Label row="2" col="3" :text="score('PHY')" class="card-item-score bold" horizontalAlignment="right"></Label>
        <Label row="2" col="4" text="PHY" class="card-item-name" horizontalAlignment="left"></Label>
      </GridLayout>

      <Label row="4" colSpan="2" :text="showOwnMeasurements ? 'practice' : 'official'" horizontalAlignment="center"
             verticalAlignment="center" v-bind:class="isLandscape ? 'm-b-5' : 'm-b-30'" v-if="!players.length"></Label>

    </GridLayout>
  </GridLayout>

  </GridLayout>
</template>

<script lang="ts">
  import { screen } from "tns-core-modules/platform";
  import * as application from "tns-core-modules/application";
  import { applicationSettingsService, authService, editingUserService } from "~/main";
  import { EventBus } from "~/services/event-bus";
  import { getPlayersInTeam } from "~/services/TeamService";
  import { getAgeMonths, getAgeYears } from "~/utils/date-util";
  import { isLandscape } from "~/utils/landscape-util";
  import PlayerSelection from "../PlayerSelection";

  export default {
    components: {
      PlayerSelection
    },

    created() {
      EventBus.$on("player-selected", result => {
        if (!result.player) {
          this.fetchTeamMeasurements();
        } else {
          this.players = [];
          this.player = result.player;
        }
      });

      const that = this;
      application.on("orientationChanged", function (arg) {
        that.isLandscape = isLandscape();
      });
    },

    computed: {
      playerName: function () {
        if (editingUserService.userWrapper.team) {
          return this.club.name;
        } else {
          return editingUserService.userWrapper.user.firstname + " " + editingUserService.userWrapper.user.lastname
        }
      },

      playerAge: function () {
        if (editingUserService.userWrapper.team) {
          return editingUserService.userWrapper.team.name;
        } else {
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
      }
    },

    data() {
      return {
        isLandscape: isLandscape(),
        isSmallScreen: (this.isLandscape ? screen.mainScreen.heightDIPs : screen.mainScreen.widthDIPs) <= 350, // fi. iPhone 5(s)/SE is 320
        player: editingUserService.userWrapper.user,
        players: [],
        getPlayerImageRows: string => {
          return Array.from({length: this.nrOfPlayerImageRows()}, (v, k) => "auto").join(",");
        },
        getPlayerImageColumns: string => {
          return Array.from({length: this.nrOfPlayerImageCols()}, (v, k) => "auto").join(",");
        },
        nrOfPlayerImageRows: number => {
          return Math.ceil(this.players.length / this.nrOfPlayerImageCols());
        },
        nrOfPlayerImageCols: number => {
          if (this.players.length > 15) {
            return 6;
          } else if (this.players.length > 12) {
            return 5;
          } else if (this.players.length > 9) {
            return 4;
          } else if (this.players.length > 4) {
            return 3;
          } else {
            return 2;
          }
        },
        getPlayerImageOffset: number => {
          const remainder = (this.players.length % this.nrOfPlayerImageCols());
          return remainder === 0 ? 0 : this.nrOfPlayerImageCols() - remainder;
        },
        club: editingUserService.userWrapper.user.playsInTeam ? editingUserService.userWrapper.user.playsInTeam.club : (editingUserService.userWrapper.user.trainsTeams ? editingUserService.userWrapper.user.trainsTeams[0].club : undefined),
        isTrainer: authService.userWrapper.user.trains !== undefined,
        isSelf: editingUserService.userWrapper.user.id === authService.userWrapper.user.id,
        self: authService.userWrapper.user,
        // trainers are always official, which also means they can't see non-official measurements by players
        showOwnMeasurements: editingUserService.userWrapper.user.id === authService.userWrapper.user.id && applicationSettingsService.isShowOwnMeasurements(),
        selectedPlayer: "Team gemiddelde", // TODO cleanup
        userWrapper: editingUserService.userWrapper,
        score: type => {
          if (this.players.length && this.$editingUserService.userWrapper.team) {
            let score = 0;
            this.players.forEach(p => {
              if (p.scores) {
                score += p.scores[this.showOwnMeasurements ? "combined" : "official"][type];
              }
            });
            return score === 0 ? "-" : Math.round(score / this.players.length);
          } else if (this.$editingUserService.userWrapper.user && this.$editingUserService.userWrapper.user.scores) {
            const score = this.$editingUserService.userWrapper.user.scores[this.showOwnMeasurements ? "combined" : "official"][type];
            return score === 0 ? "-" : score;
          }
        }
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
      },

      fetchTeamMeasurements() {
        getPlayersInTeam(editingUserService.userWrapper.team.ref)
            .then(users => this.players = users);
      }
    }
  };
</script>

<style lang="scss" scoped>
  .card-score {
    font-size: 48;
  }

  .card-role {
    font-size: 25;
    margin-bottom: 20;
  }

  .card-photo {
    width: 150;
    height: 150;
  }

  .card-photo-team {
    margin-right: 2;
  }

  .card-photo-team-2 {
    width: 72;
    height: 72;
  }

  .card-photo-team-3 {
    width: 63;
    height: 63;
  }

  .card-photo-team-4 {
    width: 52;
    height: 52;
  }

  .card-photo-team-5 {
    width: 45;
    height: 45;
  }

  .card-photo-team-6 {
    width: 36;
    height: 36;
  }

  .card-photo-trainer {
    width: 60;
    height: 60;
    margin-bottom: 5;
  }

  .card-name {
    font-size: 25;
  }

  .card-age {
    font-size: 11;
    text-transform: uppercase;
  }

  .card-item-score {
    font-size: 26;
    padding-right: 5;
    vertical-align: center;
    margin-bottom: 4;
  }

  .card-item-name {
    font-size: 22;
    vertical-align: center;
  }

  .small-screen-true {
    .card-score {
      font-size: 40;
    }

    .card-photo {
      width: 130;
      height: 130;
    }

    .card-name {
      font-size: 22;
    }

    .card-item-name {
      font-size: 18;
    }

    .card-item-score {
      font-size: 20;
      padding-right: 3;
      margin-bottom: 0;
    }

    .card-photo-team-2 {
      width: 56;
      height: 56;
    }

    .card-photo-team-3 {
      width: 46;
      height: 46;
    }

    .card-photo-team-4 {
      width: 40;
      height: 40;
    }

    .card-photo-team-5 {
      width: 36;
      height: 36;
    }

    .card-photo-team-6 {
      width: 31;
      height: 31;
    }
  }

  .landscape-true {
    .card-score {
      font-size: 26;
    }

    .card-role {
      font-size: 20;
      margin-bottom: 10;
    }

    .card-photo {
      width: 74;
      height: 74;
    }

    .card-name {
      font-size: 15;
    }

    .card-item-name {
      font-size: 14;
    }

    .card-item-score {
      font-size: 14;
      padding-right: 2;
      margin-bottom: 0;
    }

    .card-photo-team-2 {
      width: 36;
      height: 36;
    }

    .card-photo-team-3 {
      width: 26;
      height: 26;
    }

    .card-photo-team-4 {
      width: 22;
      height: 22;
    }

    .card-photo-team-5 {
      width: 18;
      height: 18;
    }

    .card-photo-team-6 {
      width: 16;
      height: 16;
    }

    .card-photo-trainer {
      width: 40;
      height: 40;
      margin-bottom: 3;
    }
  }
</style>
