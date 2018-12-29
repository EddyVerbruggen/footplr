<template>
  <StackLayout
      orientation="horizontal"
      horizontalAlignment="center"
      @tap="selectPlayer">
    <Label
        :text="iconPeople"
        class="icon"></Label>
    <Label
        :text="selectedPlayerName"
        class="player-selection bold"></Label>
    <Label
        :text="iconDropDown"
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
        console.log(">> selected, " + stuff.player.firstname);
        this.selectedPlayer = stuff.player;
      });
    },
    computed: {
      selectedPlayerName: function () {
        return this.selectedPlayer.firstname + " " + (this.selectedPlayer.lastname ? this.selectedPlayer.lastname : "");
      }
    },
    data() {
      return {
        iconPeople: String.fromCharCode(0xe7fc),
        iconDropDown: String.fromCharCode(0xe5c5),
        selectedPlayer: this.$editingUserService.userWrapper.user,
        players: undefined,
      }
    },
    methods: {
      async selectPlayer() {
        // TODO better to cache this globally, because we have 3 instances of this component
        if (!this.players) {
          // TODO may train multiple teams
          console.log(">> fetch players for: " + authService.userWrapper.user.trains[0]);
          this.players = await getPlayersInTeam(authService.userWrapper.user.trains[0]);
        }

        // TODO for teamavg, consider using a Firebase Function instead of real-time calculation
        // TODO for the profile page we don't want teams..
        const options = this.players.map(player => player.firstname + " " + (player.lastname ? player.lastname : ""));
        const cancelLabel = "Annuleren";
        const myselfLabel = "Ikzelf";
        action({
          title: "KIES EEN TEAM OF SPELER",
          actions: [myselfLabel, "vv Hoogland J09-7", ...options],
          cancelable: true,
          cancelButtonText: cancelLabel
        }).then(picked => {
          if (picked && picked !== cancelLabel) {
            this.selectedPlayer = picked;
            let player;
            if (picked === myselfLabel) {
              player = authService.userWrapper.user;
            } else {
              player = this.players[options.indexOf(picked)];
            }

            this.$editingUserService.clearListener();
            this.$editingUserService.userWrapper.user = player;
            this.$editingUserService.watchUser();

            // this.$emit('player-selected', { picked, player });
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