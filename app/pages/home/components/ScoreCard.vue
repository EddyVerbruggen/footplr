<template>
  <GridLayout rows="auto, *" class="m-b-30" columns="*" @loaded="onScoreTabLoaded">

    <PlayerSelection></PlayerSelection>

    <Label text="football player ratings" class="app-name" horizontalAlignment="center" v-if="!isTrainer"></Label>

    <Image row="1" src="~/assets/images/badge_unofficial.png" width="90%" horizontalAlignment="center" verticalAlignment="center"></Image>
    <!-- club logo (for participating clubs), or our logo (for non-participating clubs) -->
    <!--<Image src="~/assets/images/botafogo.png" height="10%" style="margin-bottom: 15.5%; opacity: 0.2" verticalAlignment="bottom"/>-->

    <GridLayout row="1" rows="4*, 4*, *, *, 4*, 4*" columns="2*, 2*, *, 2*" width="90%"
                horizontalAlignment="center" verticalAlignment="center">

      <StackLayout row="1" colSpan="2" verticalAlignment="center">
        <Label :text="score('TOTAL')" class="card-score bold" horizontalAlignment="center"
               verticalAlignment="center"></Label>
        <Label :text="userWrapper.user.position || 'positie?'" class="card-role" horizontalAlignment="center"
               @tap="selectRole"></Label>
      </StackLayout>

      <Img row="1" col="2" colSpan="2" :src="userWrapper.user.picture" stretch="aspectFill" horizontalAlignment="center" class="card-photo card-photo-unofficial"></Img>

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
  import {authService} from "~/main";
  import {getYearsSince, getMonthsSince} from "~/utils/date-util";
  import {action} from "tns-core-modules/ui/dialogs";
  import PlayerSelection from "./PlayerSelection";

  export default {
    components: {
      PlayerSelection
    },
    created() {
      console.log("ScoreCard created");
    },
    computed: {
      playerName: function () {
        return this.userWrapper.user.firstname + " " + this.userWrapper.user.lastname
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
        selectedPlayer: "Team gemiddelde",
        isTrainer: authService.userWrapper.user.trains !== undefined,
        userWrapper: authService.userWrapper,
        score: type => {
          if (authService.userWrapper.user.scores) {
            return authService.userWrapper.user.scores.official[type]; // TODO official/unofficial
          }
        },
      };
    },
    methods: {
      onScoreTabLoaded() {
        console.log("Score tab loaded @ " + new Date().getTime());
      },
      selectImage() {
        console.log("TODO: pick image and store in Firebase");
      },
      selectRole() {
        const options = ["GK (keeper)", "CM (mid-mid)", "CAM (aanvallende middenvelder)", "CF (mid-voor)"];
        action({
          title: "Op welke positie speel je?",
          actions: options
        }).then(picked => {
          console.log("Picked option: " + picked);
          if (picked) {
            picked = picked.substring(0, picked.indexOf(" ("));
            // this.playerPosition = picked;
            authService.updateUserDataInFirebase({
              position: picked
            }).then(() => console.log("Updated!"));
          }
        });
      }
    }
  };
</script>

<style scoped>
  .app-name {
    margin-top: 10;
    font-size: 20;
  }

  .card-score {
    font-size: 56;
  }

  .card-role {
    font-size: 25;
  }

  .card-photo {
    border-width: 6;
    width: 122;
    height: 122;
    border-radius: 61;
  }

  .card-photo-unofficial {
    border-color: rgba(120, 208, 175, 0.85);
  }

  .card-photo-official {
    border-color: rgba(255, 214, 132, 0.85);
  }

  .card-name {
    color: #4e66df;
    font-size: 28;
    text-transform: uppercase;
  }

  .card-age {
    font-size: 13;
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