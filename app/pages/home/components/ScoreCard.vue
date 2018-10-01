<template>
  <Shimmer :enabled="shimmerEnabled">
    <GridLayout colums="*" rows="*" @loaded="onScoreTabLoaded">
      <Image src="~/assets/images/rating.png" height="74%" style="opacity: 0.9"/>
      <!-- club logo (for participating clubs), or our logo (for non-participating clubs) -->
      <Image src="~/assets/images/botafogo.png" height="10%" style="margin-bottom: 15.5%; opacity: 0.2" verticalAlignment="bottom"/>
      <GridLayout rows="16*, 13*" columns="2*, 2*, *, 2*" height="74%" style="margin-bottom: 9%" horizontalAlignment="center">
        <StackLayout colSpan="2" verticalAlignment="center">
          <Label :text="score('TOTAL')" class="card-score" horizontalAlignment="center" verticalAlignment="center"/>
          <Label :text="userWrapper.user.position || 'positie?'" class="card-role" horizontalAlignment="center" @tap="selectRole"/>
          <Image src="~/assets/images/botafogo.png" width="50" class="card-club" verticalAlignment="top"/>
        </StackLayout>
        <StackLayout col="0" colSpan="4" horizontalAlignment="center" class="card-photo" @tap="selectImage">
          <Img src="~/assets/images/messi.jpg"/>
        </StackLayout>

        <GridLayout row="1" colSpan="4" rows="2*, 2*, 2*, 2*, 3*" columns="2*, 2*, *, 2*" width="100%" horizontalAlignment="center">
          <StackLayout row="0" colSpan="5" horizontalAlignment="center" orientation="horizontal">
            <Label :text="playerName()" class="card-name bold"/>
            <StackLayout style="margin-left: 14" verticalAlignment="center">
              <Label :text="playerAgeYears()" class="card-age-years" horizontalAlignment="right"/>
              <Label :text="playerAgeMonths()" class="card-age-months" horizontalAlignment="right"/>
            </StackLayout>
          </StackLayout>

          <Label row="1" col="0" :text="score('PAC')" class="card-item-score bold" horizontalAlignment="right"/>
          <Label row="1" col="1" text="PAC" class="card-item-name" horizontalAlignment="left"/>
          <Label row="1" col="2" :text="score('DRI')" class="card-item-score bold" horizontalAlignment="right"/>
          <Label row="1" col="3" text="DRI" class="card-item-name" horizontalAlignment="left"/>

          <Label row="2" col="0" :text="score('SHO')" class="card-item-score bold" horizontalAlignment="right"/>
          <Label row="2" col="1" text="SHO" class="card-item-name" horizontalAlignment="left"/>
          <Label row="2" col="2" :text="score('DEF')" class="card-item-score bold" horizontalAlignment="right"/>
          <Label row="2" col="3" text="DEF" class="card-item-name" horizontalAlignment="left"/>

          <Label row="3" col="0" :text="score('PAS')" class="card-item-score bold" horizontalAlignment="right"/>
          <Label row="3" col="1" text="PAS" class="card-item-name" horizontalAlignment="left"/>
          <Label row="3" col="2" :text="score('PHY')" class="card-item-score bold" horizontalAlignment="right"/>
          <Label row="3" col="3" text="PHY" class="card-item-name" horizontalAlignment="left"/>
        </GridLayout>
      </GridLayout>
    </GridLayout>
  </Shimmer>
</template>

<script>
  import {authService} from "~/main";
  import {getYearsSince, getMonthsSince} from "~/utils/date-util";
  import {action} from "tns-core-modules/ui/dialogs";

  export default {
    created() {
      console.log("ScoreCard created");
    },
    data() {
      return {
        userWrapper: authService.userWrapper,
        // tab1Msg: "Hello World 😬",
        shimmerEnabled: false,
        // tabIndex: 1, // setting this initially makes dev a little easier
        // tabView: undefined, // set below
        score: type => {
          if (authService.userWrapper.user.scores) {
            const currentScore = authService.userWrapper.user.scores[type];
            return currentScore ? currentScore : "--";
          }
        },
        // hmm.. might as well move these to 'methods'?
        playerName: () => this.userWrapper.user.firstname + " " + this.userWrapper.user.lastname,
        playerAgeYears: () => getYearsSince(new Date(this.userWrapper.user.birthdate)) + " jaar",
        playerAgeMonths: () => {
          const months = getMonthsSince(new Date(this.userWrapper.user.birthdate));
          return `${months} ${months === 1 ? "maand" : "maanden"}`;
        }
      };
    },
    methods: {
      onScoreTabLoaded() {
        console.log("Score tab loaded @ " + new Date().getTime());
        setTimeout(this.shimmer, 300);
      },
      shimmer() {
        this.shimmerEnabled = true;
        setTimeout(() => (this.shimmerEnabled = false), 300);
      },
      selectImage() {
        console.log("TODO: pick image and store in Firebase");
      },
      selectRole() {
        console.log("TODO: pick role and store in Firebase");
        const options = ["GK (keeper)", "CM (mid-mid)", "CAM (aanvallende middenvelder)", "CF (mid-voor)"];
        action({
          title: "Op welke positie speel je?",
          actions: options
        }).then(picked => {
          console.log("Picked option: " + picked);
          if (picked) {
            picked = picked.substring(0, picked.indexOf(" ("));
            // this.playerPosition = picked;
            authService
                .updateUserDataInFirebase({
                  position: picked
                })
                .then(() => console.log("Updated!"));
          }
        });
      }
    }
  };
</script>

<style scoped>
  .card-score {
    margin-top: 32%;
    font-size: 50;
  }

  .card-role {
    font-size: 25;
    margin-top: -15;
  }

  .card-club {
    margin-top: 5%;
    opacity: 0.5;
  }

  .card-photo {
    margin-left: 19%;
    margin-top: 5%;
    border-width: 6;
    border-color: #998225;
    width: 120;
    height: 120;
    border-radius: 60;
  }

  .card-name {
    font-size: 24;
    letter-spacing: -0.05;
  }

  .card-age-years {
    font-size: 14;
    letter-spacing: -0.05;
  }

  .card-age-months {
    font-size: 10;
    letter-spacing: -0.05;
  }

  .card-item-score {
    font-size: 22;
    padding-right: 6;
  }

  .card-item-name {
    font-size: 22;
    letter-spacing: -0.05;
  }
</style>
