<template>
    <StackLayout>
      <Button @tap="onTapLogout" text="Uitloggen"></Button>

      <GridLayout rows="16*, 13*" columns="2*, 2*, *, 2*" height="74%" style="margin-bottom: 9%" horizontalAlignment="center">
        <StackLayout colSpan="2" verticalAlignment="center">
          <Label :text="score('TOTAL')" class="card-score" horizontalAlignment="center" verticalAlignment="center"></Label>
          <Label :text="userWrapper.user.position || 'positie?'" class="card-role" horizontalAlignment="center" @tap="selectRole"></Label>
          <Image src="~/assets/images/botafogo.png" width="50" class="card-club" verticalAlignment="top"></Image>
        </StackLayout>
        <StackLayout col="0" colSpan="4" horizontalAlignment="center" class="card-photo" @tap="selectImage">
          <Img :src="userWrapper.user.picture" stretch="aspectFill" v-if="!savingPicture"></Img>
          <ActivityIndicator busy="true" style="margin-top: 44" v-if="savingPicture"></ActivityIndicator>
        </StackLayout>

        <!--StackLayout col="0" class="image-frame mdl-default-border m-t-20" [class.image-placeholder]="!image && !existingImageUrl" (tap)="takePicture()" horizontalAlignment="left" verticalAlignment="center">
          <Image [src]="image" stretch="aspectFill" *ngIf="image"></Image>
          <Image [src]="existingImageUrl" stretch="aspectFill" *ngIf="!image && existingImageUrl !== undefined"></Image>
          <Label class="icomoon mdl-default" style="font-size: 40" horizontalAlignment="center" [text]="'icomoon-lnr-camera' | fonticon" *ngIf="!image && existingImageUrl === undefined"></Label>
        </StackLayout-->

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
          <Label row="2" col="2" :text="score('TEC')" class="card-item-score bold" horizontalAlignment="right"/>
          <Label row="2" col="3" text="TEC" class="card-item-name" horizontalAlignment="left"/>

          <Label row="3" col="0" :text="score('PAS')" class="card-item-score bold" horizontalAlignment="right"/>
          <Label row="3" col="1" text="PAS" class="card-item-name" horizontalAlignment="left"/>
          <Label row="3" col="2" :text="score('PHY')" class="card-item-score bold" horizontalAlignment="right"/>
          <Label row="3" col="3" text="PHY" class="card-item-name" horizontalAlignment="left"/>
        </GridLayout>
      </GridLayout>
    </StackLayout>
</template>

<script>
  import routes from "~/router";
  import {authService} from "~/main";
  import {getYearsSince, getMonthsSince} from "~/utils/date-util";
  import {takeOrPickPhoto} from "~/utils/photo-util";
  import {ImageSource} from "tns-core-modules/image-source";
  import {action} from "tns-core-modules/ui/dialogs";
  import * as fs from "tns-core-modules/file-system";
  const firebaseWebApi = require("nativescript-plugin-firebase/app");

  export default {
    created() {
      console.log("Profile component created");
    },
    data() {
      return {
        savingPicture: false,
        // image /* ImageAsset | ImageSource */: undefined,
        // existingImageUrl /* string */: "~/assets/images/messi.jpg",
        userWrapper: authService.userWrapper,
        score: type => {
          if (authService.userWrapper.user.scores) {
            return authService.userWrapper.user.scores.official[type]; // TODO official/unofficial
          }
        },
        playerName: () => this.userWrapper.user.firstname + " " + this.userWrapper.user.lastname,
        playerAgeYears: () => getYearsSince(new Date(this.userWrapper.user.birthdate)) + " jaar",
        playerAgeMonths: () => {
          const months = getMonthsSince(new Date(this.userWrapper.user.birthdate));
          return `${months} ${months === 1 ? "maand" : "maanden"}`;
        }
      };
    },
    methods: {
      onTapLogout() {
        authService.logout().then(() => {
          this.$navigateTo(routes.login, {
            clearHistory: true,
            transition: {
              name: "fade"
            }
          });
        });
      },
      onScoreTabLoaded() {
        console.log("Score tab loaded @ " + new Date().getTime());
      },
      selectImage() {
        takeOrPickPhoto().then(img => {
          this.savingPicture = true;

          const storeImage = imageSource => {
            let path = fs.path.join(fs.knownFolders.documents().path, "ProfilePicToUpload.jpeg");
            if (imageSource.saveToFile(path, "jpeg", 75)) {

              const childRef = firebaseWebApi.storage().ref().child(`profilepics/${authService.userWrapper.user.id}.jpg`);

              childRef.put(fs.File.fromPath(path)).then(
                  uploadedFile => {
                    this.savingPicture = false;
                    if (uploadedFile.downloadURL) {
                      authService.updateUserDataInFirebase({
                        picture: uploadedFile.downloadURL
                      }).then(() => console.log("Updated user pic!"));
                    }
                  },
                  error => {
                    this.savingPicture = false;
                    console.log("firebase profile pic upload error: " + error);
                  });
            }
          };

          if (img instanceof ImageSource) {
            storeImage(img);
          } else {
            new ImageSource().fromAsset(img).then(imageSource => storeImage(imageSource));
          }
        });
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
    background-color: #2699fb;
    border-color: #3649a9;
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
