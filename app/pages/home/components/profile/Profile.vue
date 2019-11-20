<template>
  <ScrollView>
    <StackLayout>
      <GridLayout rows="auto, auto" columns="*">
        <PlayerSelection v-if="isTrainer"></PlayerSelection>
        <Label text="Jouw spelersprofiel" class="page-title" horizontalAlignment="center" v-if="!isTrainer"></Label>
        <Label row="1" :text="teamName" class="team-name" horizontalAlignment="center" v-if="!isTrainer"></Label>
        <Label row="1" :text="userWrapper.user.email" class="team-name" horizontalAlignment="center"
               v-if="isTrainer && !userWrapper.team"></Label>
        <Button @tap="onTapLogout" :text="iconExit" class="icon icon-green logout" horizontalAlignment="right"></Button>
      </GridLayout>

      <Label text="Kies hierboven een speler, of.." horizontalAlignment="center" class="m-x-30 m-t-30"
             v-if="userWrapper.team"></Label>
      <Button @tap="onTapAddPlayer" text="VOEG EEN SPELER TOE" class="btn btn-secondary" width="160"
              v-if="userWrapper.team"></Button>

      <ActivityIndicator :busy="isRegistering" rowSpan="2" width="30" height="30" class="m-t-30"
                         v-if="userWrapper.team"></ActivityIndicator>

      <StackLayout v-show="!userWrapper.team">
        <StackLayout horizontalAlignment="center" class="card-photo-wrapper" @tap="selectImage">
          <Label :text="iconCamera" style="font-size: 55; padding-top: 28; color: #fff" horizontalAlignment="center"
                 class="icon" v-if="!userWrapper.user.picture"></Label>
          <Img :src="userWrapper.user.picture" class="card-photo" stretch="aspectFill"
               v-if="!savingPicture && userWrapper.user.picture"></Img>
          <ActivityIndicator busy="true" style="margin-top: 45" v-if="savingPicture"></ActivityIndicator>
        </StackLayout>

        <GridLayout class="profile-form" rows="auto, auto, auto, auto" columns="50, *">
          <Label row="0" col="0" :text="iconName" class="icon icon-green" verticalAlignment="center"
                 horizontalAlignment="center"></Label>
          <Label row="0" col="1" :text="userWrapper.user.firstname || 'Voornaam'" class="profile-field"
                 v-bind:class="userWrapper.user.firstname ? '' : 'not-filled'" verticalAlignment="center"
                 @tap="enterFirstname"></Label>

          <Label row="1" col="1" :text="userWrapper.user.lastname || 'Achternaam'" class="profile-field"
                 v-bind:class="userWrapper.user.lastname ? '' : 'not-filled'" verticalAlignment="center"
                 @tap="enterLastname"></Label>

          <Label row="2" col="0" :text="iconLocation" class="icon icon-green" horizontalAlignment="center"
                 verticalAlignment="center"></Label>
          <StackLayout row="2" col="1" orientation="horizontal" class="profile-field" verticalAlignment="center"
                       @tap="selectPosition">
            <Label :text="playerPosition" verticalAlignment="center"></Label>
            <Label :text="iconDropDown" class="icon"></Label>
          </StackLayout>

          <Label row="3" col="0" :text="iconDate" class="icon icon-green" horizontalAlignment="center"
                 verticalAlignment="center"></Label>

          <StackLayout row="3" col="1" orientation="horizontal" class="profile-field profile-field-last"
                       verticalAlignment="center" @tap="editBirthDate()">
            <Label :text="birthDateFormatted" verticalAlignment="center"></Label>
            <Label :text="iconDropDown" class="icon"></Label>
          </StackLayout>
        </GridLayout>
      </StackLayout>

    </StackLayout>
  </ScrollView>
</template>

<script lang="ts">
  import * as firebaseWebApi from "nativescript-plugin-firebase/app";
  import * as fs from "tns-core-modules/file-system";
  import { ImageSource } from "tns-core-modules/image-source";
  import { action, prompt } from "tns-core-modules/ui/dialogs";
  import { authService, editingUserService } from "~/main";
  import routes from "~/router";
  import { EventBus } from "~/services/event-bus";
  import {
    getAllPlayerPositionDescriptions,
    getPlayerPositionKeyForValue,
    getPlayerPositionValueForKey
  } from "~/shared/player-position";
  import { formatDate } from "~/utils/date-util";
  import { showError, showInfo } from "~/utils/feedback-util";
  import { takeOrPickPhoto } from "~/utils/photo-util";
  import PlayerSelection from "../PlayerSelection";
  import UpdateBirthDate from "./UpdateBirthDate.vue"
  import { isIOS } from "tns-core-modules/platform";

  export default {
    components: {
      PlayerSelection
    },

    mounted() {
      if (this.userWrapper.user && !this.userWrapper.user.birthdate) {
        setTimeout(() => {
          showInfo("Vul even je geboortedatum in 🙏", "De app is handiger in gebruik als we weten hoe oud je bent.. dankjewel!", "profile");
        }, 800);
      }
    },

    computed: {
      playerPosition: function () {
        if (this.userWrapper.user && this.userWrapper.user.position) {
          return getPlayerPositionValueForKey(this.userWrapper.user.position);
        } else {
          return "Op welke positie speel je?";
        }
      },
      birthDateFormatted: function () {
        if (this.userWrapper.user && !this.userWrapper.user.birthdate) {
          return "Wat is je geboortedatum?";
        }
        return this.userWrapper.user ? formatDate(this.userWrapper.user.birthdate) : "";
      },
      teamName: function () {
        return this.$authService.userWrapper.user.playsInTeam ? this.$authService.userWrapper.user.playsInTeam.name : undefined;
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
        userWrapper: editingUserService.userWrapper,
        isTrainer: authService.userWrapper.user.trains !== undefined,
        isRegistering: false,
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

      onTapAddPlayer() {
        prompt({
          title: "Wat is het emailadres?",
          message: "Heeft de speler nog geen FPR account, dan ontvangt hij of zij een mailtje met verdere instructies op dit emailadres.",
          defaultText: "",
          okButtonText: "Toevoegen",
          cancelButtonText: "Annuleren"
        }).then(data => {
          if (data.result) {
            this.isRegistering = true;
            const email = data.text.trim().toLowerCase();

            this.$authService
                .getExistingUser(email)
                .then(user => {
                  if (user) {
                    this.userWrapper.user = user;
                    this.$editingUserService.userWrapper.user = user;
                    this.$editingUserService.userRef = user.ref;
                    this.$editingUserService.updateUserDataInFirebase({
                      playsin: this.userWrapper.team.ref
                    }).then(() => {
                      this.isRegistering = false;
                      this.$editingUserService.userWrapper.team = undefined;
                      this.$editingUserService.watchUser();
                      EventBus.$emit("player-selected", {player: user});
                      EventBus.$emit("update-players");
                    });

                  } else {
                    this.$authService
                        .register(email, this.generatePassword(), this.userWrapper.team.ref, true)
                        .then(user => {
                          this.isRegistering = false;
                          showInfo("De speler is aangemaakt", "Vul hieronder het profiel zoveel mogelijk aan");
                          setTimeout(() => {
                            this.userWrapper.user = user;
                            this.$editingUserService.userWrapper.user = user;
                            this.$editingUserService.userWrapper.team = undefined;
                            this.$editingUserService.watchUser();
                            EventBus.$emit("player-selected", {player: user});
                            EventBus.$emit("update-players");
                          }, 500);
                        })
                        .catch(error => {
                          this.isRegistering = false;
                          console.log("Failed to register player: " + error);
                          showError("Fout bij het registreren ☹️", error);
                        })

                  }
            });
          }
        });
      },

      generatePassword() {
        // TODO
        return "fpr123"; // + (Math.random() * 10000);
      },

      selectImage() {
        takeOrPickPhoto().then(img => {
          this.savingPicture = true;

          const storeImage = imageSource => {
            let path = fs.path.join(fs.knownFolders.documents().path, "ProfilePicToUpload.jpeg");
            if (imageSource.saveToFile(path, "jpeg", 80)) {

              const childRef = firebaseWebApi.storage().ref().child(`profilepics/${editingUserService.userWrapper.user.id}.jpg`);

              childRef.put(fs.File.fromPath(path)).then(
                  uploadedFile => {
                    this.savingPicture = false;
                    if (uploadedFile.downloadURL) {
                      editingUserService.updateUserDataInFirebase({
                        picture: uploadedFile.downloadURL
                      }).then(() => {
                        EventBus.$emit("player-selected", {player: this.userWrapper.user});
                      });
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
          fullscreen: !isIOS,
          props: {
            birthdate: this.userWrapper.user.birthdate
          }
        }).then(birthdate => {
          const isAuthUserWithoutBirthDate = this.$editingUserService.userWrapper.user.id === this.$authService.userWrapper.user.id &&
              !this.$authService.userWrapper.user.birthdate;
          if (birthdate) {
            this.$editingUserService.updateUserDataInFirebase({
              birthdate
            }).then(() => {
              if (isAuthUserWithoutBirthDate) {
                showInfo("Bedankt voor het invullen", "Je kunt nu onderin een andere pagina kiezen. Veel plezier met de app!", "profile");
                this.$authService.userWrapper.user.birthdate = birthdate;
                // "reload" home, so we can show the other tabs (which were hidden because of the missing birthdate)
                this.$navigateTo(routes.home, {clearHistory: true, animated: false, props: {loadProfileTab: true}});
              } else {
                EventBus.$emit("player-selected", {player: this.userWrapper.user});
              }
            });
          }
        });
      },

      selectPosition() {
        const options = getAllPlayerPositionDescriptions();
        const cancelButtonLabel = "Annuleren";
        action({
          title: "Op welke positie speel je?",
          actions: options,
          cancelable: true,
          cancelButtonText: cancelButtonLabel
        }).then(picked => {
          if (picked && picked !== cancelButtonLabel) {
            picked = getPlayerPositionKeyForValue(picked); //  picked.substring(0, picked.indexOf(" ("));
            this.userWrapper.user.position = picked;
            this.$editingUserService.updateUserDataInFirebase({
              position: picked
            }).then(() => {
              EventBus.$emit("player-selected", {player: this.userWrapper.user});
            });
          }
        });
      },

      enterFirstname() {
        prompt({
          message: "Voornaam",
          defaultText: this.userWrapper.user.firstname,
          okButtonText: "Opslaan",
          cancelButtonText: "Annuleren"
        }).then(data => {
          if (data.result && data.text !== "text") {
            editingUserService.updateUserDataInFirebase({
              firstname: data.text || ""
            }).then(() => {
              EventBus.$emit("player-selected", {player: this.userWrapper.user});
              EventBus.$emit("update-players");
            });
          }
        });
      },

      enterLastname() {
        prompt({
          message: "Achternaam",
          defaultText: this.userWrapper.user.lastname,
          okButtonText: "Opslaan",
          cancelButtonText: "Annuleren"
        }).then(data => {
          if (data.result && data.text !== "text") {
            editingUserService.updateUserDataInFirebase({
              lastname: data.text || ""
            }).then(() => {
              EventBus.$emit("player-selected", {player: this.userWrapper.user});
              EventBus.$emit("update-players");
            });
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

  .profile-field.profile-field-last {
    border-bottom-width: 0;
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
    border-color: #67d4a5;
    border-width: 2;
    margin-top: 40;
    width: 110;
    height: 110;
    border-radius: 55;
  }

  .card-photo {
    border-radius: 55;
  }

  .team-name {
    margin-top: 10;
    font-size: 13;
    opacity: 0.8;
  }

  Label.not-filled {
    color: #9598a9;
  }
</style>
