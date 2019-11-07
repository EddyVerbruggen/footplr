<template>
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

<script lang="ts">
  import { action } from "tns-core-modules/ui/dialogs";
  import { authService } from "~/main";
  import { EventBus } from "~/services/event-bus";
  import { getPlayersInTeam, getTeam } from "~/services/TeamService"

  export default {
    name: "PlayerSelection",

    created() {
      EventBus.$on("player-selected", stuff => this.selectedPlayer = stuff.player);
      EventBus.$on("update-players", () => this.players = undefined);
    },

    mounted() {
      this.fillPlayersAndTeams();
    },

    computed: {
      selectedPlayerName: function () {
        if (this.selectedPlayer) {
          if (!this.selectedPlayer.firstname && !this.selectedPlayer.lastname) {
            return "Speler zonder naam";
          } else {
            return this.selectedPlayer.firstname + " " + (this.selectedPlayer.lastname ? this.selectedPlayer.lastname : "");
          }
        } else if (this.$editingUserService.userWrapper.team) {
          return this.$editingUserService.userWrapper.team.name;
        }
      }
    },

    data() {
      return {
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
        // just to be on the safe side
        if (!this.teams || !this.players) {
          await this.fillPlayersAndTeams();
        }

        const teamPrefix = "TEAM: "; // TODO add the club name (unless it's all the same club)
        let options = [];

        this.teams.map(team => {
          options.push(`${teamPrefix}${team.name}`);
          const players = this.players
              .filter(player => player.playsInTeam.id === team.id)
              .map(player => player.firstname + " " + (player.lastname ? player.lastname : ""));
          options = options.concat(players);
        });

        const cancelLabel = "Annuleren";
        const myselfLabel = "ik";
        action({
          title: "Kies een team of speler",
          actions: [myselfLabel, ...options],
          cancelable: true,
          cancelButtonText: cancelLabel
        }).then(picked => {
          if (picked && picked !== cancelLabel) {
            this.$editingUserService.clearListener();

            let player;
            if (picked === myselfLabel) {
              player = authService.userWrapper.user;
              this.$editingUserService.userWrapper.user = player;
              this.$editingUserService.userWrapper.team = undefined;
            } else if (picked.startsWith(teamPrefix)) {
              this.$editingUserService.userWrapper.team = this.teams.filter(team => picked === `${teamPrefix}${team.name}`)[0];
            } else {
              player = this.players.filter(p => picked === (p.firstname + " " + (p.lastname ? p.lastname : "")))[0];
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
