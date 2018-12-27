<template>
  <Label
      :text="selectedPlayer"
      class="player-selection bold"
      v-if="isTrainer"
      @tap="selectPlayer"></Label>
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
    data() {
      return {
        selectedPlayer: "vv Hoogland J09-7",
        isTrainer: authService.userWrapper.user.trains !== undefined,
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
        const options = this.players.map(player => player.firstname + " " + player.lastname); // ["GK (keeper)", "CM (mid-mid)", "CAM (aanvallende middenvelder)", "CF (mid-voor)"];
        action({
          title: "KIES EEN TEAM OF SPELER",
          actions: ["vv Hoogland J09-7", ...options],
          cancelable: true
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
  .player-selection {
    font-size: 12;
    text-transform: uppercase;
    text-align: center;
    padding: 10;
    margin-top: 4;
  }
</style>