<template>
  <!-- TODO add team selection here as well, but don't show in case the trainer only trains one team -->
  <StackLayout
      orientation="horizontal"
      horizontalAlignment="center"
      @tap="selectPlayer">
    <Label
        :text="selectedPlayer ? iconPerson : iconPeople"
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
  import {getPlayersInTeam, getTeam} from "~/services/TeamService"
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
        if (this.selectedPlayer) {
          return this.selectedPlayer.firstname + " " + (this.selectedPlayer.lastname ? this.selectedPlayer.lastname : "");
        } else if (this.$editingUserService.userWrapper.team) {
          return this.$editingUserService.userWrapper.team.name
        }
      }
    },
    data() {
      return {
        date: new Date().getTime(),
        iconPerson: String.fromCharCode(0xe7fd),
        iconPeople: String.fromCharCode(0xe7fc),
        iconDropDown: String.fromCharCode(0xe5c5),
        selectedPlayer: this.$editingUserService.userWrapper.user,
        players: undefined,
        teams: undefined,
      }
    },
    methods: {
      getSelectedPlayerName() {
        return new Date().getTime()
      },
      async selectPlayer() {
        // TODO better to cache this globally, because we have 3 instances of this component
        if (!this.players || !this.teams) {
          this.players = [];
          this.teams = [];
          for (let i = 0; i < authService.userWrapper.user.trains.length; i++) {
            this.players = this.players.concat(await getPlayersInTeam(authService.userWrapper.user.trains[i]));
            this.teams = this.teams.concat(await getTeam(authService.userWrapper.user.trains[i]));
          }
        }
        this.players.sort();
        this.teams.sort();

        const teamPrefix = "TEAM: ";
        let options = this.teams.map(team => `${teamPrefix}${team.name}`);
        const players = this.players.map(player => player.firstname + " " + (player.lastname ? player.lastname : ""));
        options = options.concat(players);
        const cancelLabel = "Annuleren";
        const myselfLabel = "ik";
        action({
          title: "Kies een team of speler",
          actions: [myselfLabel, ...options],
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
              this.$editingUserService.userWrapper.team = undefined;
            } else if (picked.startsWith(teamPrefix)) {
              this.$editingUserService.userWrapper.team = this.teams[options.indexOf(picked)];
            } else {
              player = this.players[options.indexOf(picked) - this.teams.length];
              this.$editingUserService.userWrapper.user = player;
              this.$editingUserService.userWrapper.team = undefined;
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