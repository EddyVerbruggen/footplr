<template>
  <StackLayout
      orientation="horizontal"
      horizontalAlignment="center"
      @tap="selectPlayer">
    <Label
        :text="iconPeople"
        class="icon"></Label>
    <Label
        :text="selectedPlayer"
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

  export default {
    name: 'PlayerSelection',
    created() {
      console.log("PlayerSelection created");
    },
    mounted() {
      console.log("PlayerSelection mounted");
    },
    updated() {
      console.log("PlayerSelection updated " + this + ", " + authService.userWrapper.user.firstname);
    },
    data() {
      return {
        iconPeople: String.fromCharCode(0xe7fc),
        iconDropDown: String.fromCharCode(0xe5c5),
        // selectedPlayer: "vv Hoogland J09-7",
        selectedPlayer: authService.userWrapper.user.firstname + " " + (authService.userWrapper.user.lastname ? authService.userWrapper.user.lastname : ""),
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
        const options = this.players.map(player => player.firstname + " " + (player.lastname ? player.lastname : ""));
        action({
          title: "KIES EEN TEAM OF SPELER",
          actions: ["vv Hoogland J09-7", ...options],
          cancelable: true,
          cancelButtonText: "Annuleren"
        }).then(picked => {
          if (picked) {
            this.selectedPlayer = picked;
            this.$emit('player-selected', {picked, player: this.players[options.indexOf(picked)]});
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