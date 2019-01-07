<template>
  <!-- TODO add team selection here as well, but don't show in case the trainer only trains one team -->
  <StackLayout
      orientation="horizontal"
      horizontalAlignment="center"
      @tap="selectPlayer">
    <Label
        :text="iconPeople"
        verticalAlignment="center"
        class="icon"></Label>
    <Label
        :text="selectedPlayerName"
        class="player-selection bold"></Label>
    <Label
        :text="iconDropDown"
        verticalAlignment="center"
        class="icon"></Label>
  </StackLayout>
</template>

<script>
  import {action} from "tns-core-modules/ui/dialogs";
  import {authService} from "~/main";
  import {getPlayersInTeam} from "~/services/TeamService"
  import {EventBus} from "~/services/event-bus";

  export default {
    name: "PlayerSelection",
    created() {
      EventBus.$on("player-selected", stuff => {
        console.log("player-selected @ PlayerSelection: " + stuff.player);
        this.selectedPlayer = stuff.player;
        this.date = new Date().getTime();
      });
      EventBus.$on("update-players", () => this.players = undefined);
    },
    computed: {
      selectedPlayerName: function () {
        console.log("calling selectedPlayerName");
        if (this.selectedPlayer) {
          return this.selectedPlayer.firstname + " " + (this.selectedPlayer.lastname ? this.selectedPlayer.lastname : "");
        } else {
          return "GEHELE TEAM";
        }
      }
    },
    data() {
      return {
        date: new Date().getTime(),
        iconPeople: String.fromCharCode(0xe7fc),
        iconDropDown: String.fromCharCode(0xe5c5),
        selectedPlayer: this.$editingUserService.userWrapper.user,
        // selectedPlayerName: this.$editingUserService.userWrapper.user ? (this.$editingUserService.userWrapper.user.firstname + " " + (this.$editingUserService.userWrapper.user.lastname ? this.$editingUserService.userWrapper.user.lastname : "")) : "GEHELE TEAM",
        players: undefined,
      }
    },
    methods: {
      getSelectedPlayerName() {
        return new Date().getTime()
      },
      async selectPlayer() {
        // TODO better to cache this globally, because we have 3 instances of this component
        if (!this.players) {
          // TODO may train multiple teams
          console.log(">> fetch players for: " + authService.userWrapper.user.trains[0]);
          this.players = await getPlayersInTeam(authService.userWrapper.user.trains[0]);
        }

        // TODO for teamavg, consider using a Firebase Function instead of real-time calculation
        // TODO for the profile page we don't want teams.. (so just show authUser if a team was selected.. or edit team settings (if any))
        const options = this.players.map(player => player.firstname + " " + (player.lastname ? player.lastname : ""));
        const cancelLabel = "Annuleren";
        const myselfLabel = "Ikzelf 😀";
        const entireTeamLabel = "GEHELE TEAM";
        action({
          title: "Kies een speler",
          actions: [myselfLabel, entireTeamLabel, ...options],
          cancelable: true,
          cancelButtonText: cancelLabel
        }).then(picked => {
          if (picked && picked !== cancelLabel) {
            // this.selectedPlayer = picked;
            this.$editingUserService.clearListener();

            let player;
            if (picked === myselfLabel) {
              player = authService.userWrapper.user;
              this.$editingUserService.userWrapper.user = player;
              this.$editingUserService.userWrapper.teamRef = undefined;
            } else if (picked === entireTeamLabel) {
              // TODO correct team
              this.$editingUserService.userWrapper.teamRef = authService.userWrapper.user.trains[0];
            } else {
              console.log({picked});
              console.log("options.indexOf(picked): " + options.indexOf(picked));
              player = this.players[options.indexOf(picked)];
              this.$editingUserService.userWrapper.user = player;
              this.$editingUserService.userWrapper.teamRef = undefined;
            }

            this.$editingUserService.watchUser();

            EventBus.$emit('player-selected', { picked, player });
          }
        });
      }
    }
  }
</script>

<style scoped>
  Label.player-selection {
    font-size: 16;
    text-align: center;
    padding: 10 3 10 7;
    margin-top: 4;
  }
</style>