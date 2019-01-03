<template>
  <GridLayout rows="auto, *" class="m-b-30" columns="*" @loaded="onScoreTabLoaded">

    <PlayerSelection v-if="isTrainer"></PlayerSelection>

    <StackLayout class="m-t-10" width="90%" v-if="!isTrainer">
      <Label text="football player ratings" class="page-title" horizontalAlignment="center"></Label>
      <GridLayout columns="auto, auto" class="m-t-10" horizontalAlignment="center" @tap="isOfficial = !isOfficial">
        <Switch :checked="!isOfficial"></Switch>
        <Label col="1" text="toon ook eigen metingen" class="p-10"></Label>
      </GridLayout>
    </StackLayout>

    <Image row="1" :src="'~/assets/images/badge_' + (isOfficial ? '' : 'un') + 'official.png'" width="90%" horizontalAlignment="center" verticalAlignment="center"></Image>
    <!-- club logo (for participating clubs), or our logo (for non-participating clubs) -->
    <!--<Image src="~/assets/images/botafogo.png" height="10%" style="margin-bottom: 15.5%; opacity: 0.2" verticalAlignment="bottom"/>-->

    <GridLayout row="1" rows="4*, 4*, *, *, 4*, 4*" columns="2*, 2*, *, 2*" width="90%"
                horizontalAlignment="center" verticalAlignment="center">

      <StackLayout row="1" colSpan="2" verticalAlignment="center">
        <Label :text="score('TOTAL')" class="card-score bold" horizontalAlignment="center" verticalAlignment="center"></Label>
        <Label :text="userWrapper.user.position || 'positie?'" class="card-role" horizontalAlignment="center"></Label>
      </StackLayout>

      <WebImage row="1" col="2" colSpan="2" :src="userWrapper.user.picture" stretch="aspectFill" horizontalAlignment="left" verticalAlignment="top" class="card-photo"></WebImage>

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
  import {authService, editingUserService} from "~/main";
  import {getYearsSince, getMonthsSince} from "~/utils/date-util";
  import PlayerSelection from "../PlayerSelection";
  import {EventBus} from "~/services/event-bus";
  import {GlobalStore} from "~/services/global-store";

  export default {
    components: {
      PlayerSelection
    },
    created() {
      console.log("ScoreCard created");
      EventBus.$on("player-selected", stuff => this.userWrapper.user = stuff.player);
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
        const months = getMonthsSince(new Date(this.userWrapper.user.birthdate));
        return `${getYearsSince(new Date(this.userWrapper.user.birthdate))} jaar en ${months} ${months === 1 ? "maand" : "maanden"}`;
      }
    },
    data() {
      return {
        isOfficial: GlobalStore.isOfficial,
        selectedPlayer: "Team gemiddelde",
        isTrainer: authService.userWrapper.user.trains !== undefined,
        userWrapper: editingUserService.userWrapper,
        score: type => {
          if (this.$editingUserService.userWrapper.user.scores) {
            return this.$editingUserService.userWrapper.user.scores[this.isOfficial ? "official" : "unofficial"][type];
          }
        },
      };
    },
    methods: {
      onScoreTabLoaded() {
        console.log("Score tab loaded @ " + new Date().getTime());
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