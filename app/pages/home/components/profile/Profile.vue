<template>
  <ScrollView>
    <StackLayout>
      <GridLayout rows="auto" columns="*">
        <PlayerSelection v-if="isTrainer"></PlayerSelection>
        <Label text="Jouw spelersprofiel" class="page-title" horizontalAlignment="center" v-if="!isTrainer"></Label>
        <Button @tap="onTapLogout" :text="iconExit" class="icon icon-green logout" horizontalAlignment="right"></Button>
      </GridLayout>

      <StackLayout horizontalAlignment="center" class="card-photo-wrapper" @tap="selectImage">
        <Label :text="iconCamera" style="font-size: 55; padding-top: 28; color: #fff" horizontalAlignment="center" class="icon" v-if="!userWrapper.user.picture"></Label>
        <Img :src="userWrapper.user.picture" class="card-photo" stretch="aspectFill" v-if="!savingPicture && userWrapper.user.picture"></Img>
        <ActivityIndicator busy="true" style="margin-top: 44" v-if="savingPicture"></ActivityIndicator>
      </StackLayout>

      <GridLayout class="profile-form" rows="auto, auto, auto, auto" columns="50, *">
        <Label row="0" col="0" :text="iconName" class="icon icon-green" verticalAlignment="center" horizontalAlignment="center"></Label>
        <TextField
            row="0"
            col="1"
            class="profile-field"
            hint="Voornaam"
            returnKeyType="next"
            @focus="focusFirstName"
            @blur="blurFirstName"
            @returnPress="focusLastName()"
            v-model="userWrapper.user.firstname"
            autocorrect="false"></TextField>

        <TextField
            row="1"
            col="1"
            class="profile-field"
            hint="Achternaam"
            returnKeyType="done"
            @focus="focusLastName"
            @blur="blurLastName"
            v-model="userWrapper.user.lastname"
            autocorrect="false"></TextField>

        <Label row="2" col="0" :text="iconLocation" class="icon icon-green" horizontalAlignment="center" verticalAlignment="center" v-if="!editingBirthDate"></Label>
        <StackLayout row="2" col="1" orientation="horizontal" class="profile-field" verticalAlignment="center" @tap="selectPosition" v-if="!editingBirthDate">
          <Label :text="userWrapper.user.position || 'Op welke positie speel je?'" verticalAlignment="center"></Label>
          <Label :text="iconDropDown" class="icon"></Label>
        </StackLayout>

        <Label row="3" col="0" :text="iconDate" class="icon icon-green" horizontalAlignment="center" verticalAlignment="center"></Label>

        <StackLayout row="3" col="1" orientation="horizontal" class="profile-field" verticalAlignment="center" @tap="editBirthDate()">
          <Label :text="birthDateFormatted" verticalAlignment="center"></Label>
          <Label :text="iconDropDown" class="icon"></Label>
        </StackLayout>
      </GridLayout>

    </StackLayout>
  </ScrollView>
</template>

<script>
  import routes from "~/router";
  import {authService, editingUserService} from "~/main";
  import {takeOrPickPhoto} from "~/utils/photo-util";
  import {formatDate} from "~/utils/date-util";
  import {ImageSource} from "tns-core-modules/image-source";
  import {action} from "tns-core-modules/ui/dialogs";
  import * as fs from "tns-core-modules/file-system";
  import PlayerSelection from "../PlayerSelection";
  import UpdateBirthDate from "./UpdateBirthDate.vue"

  const firebaseWebApi = require("nativescript-plugin-firebase/app");

  export default {
    components: {
      PlayerSelection
    },

    computed: {
      birthDateFormatted: function () {
        if (!this.userWrapper.user.birthdate) {
          return "Wat is je geboortedatum?";
        }
        return formatDate(this.userWrapper.user.birthdate);
      }
    },

    data() {
      return {
        // for char codes, see https://github.com/google/material-design-icons/blob/master/iconfont/codepoints
        iconCamera: String.fromCharCode(0xe3b0),
        iconName: String.fromCharCode(0xe85d),
        iconLocation: String.fromCharCode(0xe55f),
        iconDate: String.fromCharCode(0xe916),
        iconExit: String.fromCharCode(0xe879),
        iconDropDown: String.fromCharCode(0xe5c5),
        savingPicture: false,
        editingBirthDate: false,
        userWrapper: editingUserService.userWrapper,
        isTrainer: authService.userWrapper.user.trains !== undefined,
        playerName: () => this.userWrapper.user.firstname + " " + this.userWrapper.user.lastname,
      };
    },
    methods: {
      onTapLogout() {
        authService.logout().then(() => {
          editingUserService.clearListener();
          this.$navigateTo(routes.login, {
            clearHistory: true,
            transition: {
              name: "fade"
            }
          });
        });
      },

      focusFirstName() {
        console.log("Focus firstname");
      },

      blurFirstName() {
        console.log("Blur firstname");
        editingUserService.updateUserDataInFirebase({
          firstname: this.userWrapper.user.firstname
        }).then(() => console.log("Updated firstname"));
      },

      blurLastName() {
        console.log("Blur lastname");
        editingUserService.updateUserDataInFirebase({
          lastname: this.userWrapper.user.lastname
        }).then(() => console.log("Updated lastname"));
      },

      changeFirstName() {
        console.log("Text change firstname");
      },

      changeLastName() {
        console.log("Text change firstname");
      },

      focusLastName() {
        console.log("Focus lastname");
      },

      selectImage() {
        takeOrPickPhoto().then(img => {
          this.savingPicture = true;

          const storeImage = imageSource => {
            let path = fs.path.join(fs.knownFolders.documents().path, "ProfilePicToUpload.jpeg");
            if (imageSource.saveToFile(path, "jpeg", 75)) {

              const childRef = firebaseWebApi.storage().ref().child(`profilepics/${editingUserService.userWrapper.user.id}.jpg`);

              childRef.put(fs.File.fromPath(path)).then(
                  uploadedFile => {
                    this.savingPicture = false;
                    if (uploadedFile.downloadURL) {
                      editingUserService.updateUserDataInFirebase({
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

      editBirthDate() {
        this.$showModal(UpdateBirthDate, {
          fullscreen: true,
          props: {
            birthdate: this.userWrapper.user.birthdate
          }
        }).then(birthdate => {
          console.log({birthdate});
          if (birthdate) {
            this.$editingUserService.updateUserDataInFirebase({
              birthdate
            }).then(() => console.log("Updated birthdate"));
          }
        });
      },

      selectPosition() {
        const options = ["GK (keeper)", "CM (mid-mid)", "CAM (aanvallende middenvelder)", "CF (mid-voor)"];
        action({
          title: "Op welke positie speel je?",
          actions: options
        }).then(picked => {
          console.log("Picked option: " + picked);
          if (picked) {
            picked = picked.substring(0, picked.indexOf(" ("));
            this.userWrapper.user.position = picked;
            this.$editingUserService.updateUserDataInFirebase({
              position: picked
            }).then(() => console.log("Updated!"));
          }
        });
      }
    }
  };
</script>

<style scoped>
  .profile-form {
    width: 100%;
    padding: 24 24 24 12;
  }

  .profile-field {
    font-size: 16;
    padding: 20 0;
    border-bottom-color: #cccdd6;
    border-bottom-width: 1;
    placeholder-color: #9598a9;
  }

  .icon-green {
    color: #67d4a5;
  }

  .logout {
    padding-top: 12;
    padding-right: 12;
  }

  .platform-android .logout {
    border-radius: 1; /* nicer buttons on Android */
    width: 44;
  }

  .card-photo-wrapper {
    background-color: #9093a6;
    margin-top: 60;
    width: 110;
    height: 110;
    border-radius: 55;
  }

  .card-photo {
    border-radius: 55;
  }
</style>