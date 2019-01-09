<template>
  <!-- TODO add team selection here as well, but don't show in case the trainer only trains one team -->
  <StackLayout
      orientation="horizontal"
      horizontalAlignment="center"
      verticalAlignment="top"
      @tap="selectPlayer">
    <Label
        :text="selectedPlayer ? iconPerson : iconPeople"
        verticalAlignment="center"
        class="icon"></Label>
    <Label
        :text="selectedPlayerName"
        verticalAlignment="center"
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
        this.selectedPlayer = stuff.player;
        this.date = new Date().getTime();
      });
      EventBus.$on("update-players", () => this.players = undefined);
    },

    mounted() {
      this.fillPlayersAndTeams();
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
      async fillPlayersAndTeams() {
        // TODO better to do this somewhere globally and grab that, because we have 3 instances of this component
        this.players = [];
        this.teams = [];
        console.log("authService.userWrapper.user.trains: " + authService.userWrapper.user.trains.length);
        for (let i = 0; i < authService.userWrapper.user.trains.length; i++) {
          this.players = this.players.concat(await getPlayersInTeam(authService.userWrapper.user.trains[i]));
          this.teams = this.teams.concat(await getTeam(authService.userWrapper.user.trains[i]));
        }
        // make sure the trainer is not included in this list (looks silly)
        this.players = this.players.filter(player => player.id !== authService.userWrapper.user.id);
        this.players.sort();
        this.teams.sort();
      },

      async selectPlayer() {
        console.log("selectPlayer tapped, this.teams: " + this.teams);

        // just to be on the safe side
        if (!this.teams || !this.players) {
          await this.fillPlayersAndTeams();
        }

        const teamPrefix = "TEAM: "; // TODO add the club name
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
            EventBus.$emit('player-selected', {picked, player});
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