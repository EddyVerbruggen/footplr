<template>
  <StackLayout>
    <Button @tap="onTapLogout" text="Uitloggen"></Button>

    <StackLayout horizontalAlignment="center" class="card-photo" @tap="selectImage">
      <Img :src="userWrapper.user.picture" style="border-radius: 10" stretch="aspectFill" v-if="!savingPicture"></Img>
      <ActivityIndicator busy="true" style="margin-top: 44" v-if="savingPicture"></ActivityIndicator>
    </StackLayout>

    <Label :text="userWrapper.user.position || 'positie?'" class="card-role" horizontalAlignment="center" @tap="selectRole"></Label>

    <!--<Label :text="playerName()" class="card-name bold"></Label>-->

    <DatePicker row="3" colSpan="2" v-model="userWrapper.user.birthdate"></DatePicker>

  </StackLayout>
</template>

<script>
  import routes from "~/router";
  import {authService} from "~/main";
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
        userWrapper: authService.userWrapper,
        playerName: () => this.userWrapper.user.firstname + " " + this.userWrapper.user.lastname,
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
</style>