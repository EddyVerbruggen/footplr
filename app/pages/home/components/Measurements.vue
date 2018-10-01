<template>
  <StackLayout style="background-color: #B8FFBD">

    <SegmentedBar row="0" style="margin: 10" width="80%" height="30" color="white" borderWidth="1" borderRadius="4" borderColor="darkgreen" backgroundColor="green" selectedBackgroundColor="darkgreen" v-model="selectedListOrGraphIndex">
      <SegmentedBarItem title="Lijst"/>
      <SegmentedBarItem title="Grafiek"/>
    </SegmentedBar>

    <GridLayout rows="auto, auto, *, auto" colums="*" verticalAlignment="top" height="100%" :visibility="selectedListOrGraphIndex === 0 ? 'visible' : 'collapse'">
      <GridLayout row="1" columns="2*, 3*, 2*, 2*" class="m-x-8 scoreTable">
        <Label col="0" text="Datum" class="m-l-10 p-10 bold"/>
        <Label col="1" :text="exercise + ' ▽'" class="p-10 bold" @tap="filterExercise"/>
        <Label col="2" text="Score" class=" p-10 bold" horizontalAlignment="right"/>
        <Label col="3" text="Officieel" class="m-r-10 p-10 bold" horizontalAlignment="right"/>
      </GridLayout>

      <ListView row="2" :items="measurements" @itemTap="onItemTap" class="m-x-8 c-bg-white scoreTable" style="border-radius: 4; border-width: 1px; border-color: #ddd">
        <v-template>
          <GridLayout columns="2*, 3*, 2*, 2*">
            <Label col="0" :text="item.date" class="m-l-10 p-10"/>
            <Label col="1" :text="item.exercise" class="p-10"/>
            <Label col="2" :text="item.score" class="p-10" horizontalAlignment="right"/>
            <Label col="3" :text="item.official" class="m-r-10 p-10" horizontalAlignment="right"/>
          </GridLayout>
        </v-template>
      </ListView>

      <Button row="3" @tap="add()" text="Toevoegen!"/>
    </GridLayout>

  </StackLayout>
</template>

<script>
  import {formatDate} from "~/utils/date-util";
  import {action} from "tns-core-modules/ui/dialogs";

  const measurements = [];

  export default {
    created() {
      console.log("Measurements created");
      this.fetchMeasurements();
    },
    data() {
      return {
        exercise: "Alle oefeningen",
        player: undefined,
        selectedListOrGraphIndex: 0,
        measurements,
        getAuthService: this.$authService,
        getAuthService2: () => this.$authService
      }
    },
    methods: {
      add() {
        console.log("add..");
      },
      fetchMeasurements(filterExercise = undefined) {
        const result = [];
        this.getAuthService2().userRef.collection("measurements")
            // .where("exercise", "==", "CA") // TODO in case of filter
            .orderBy("date", "desc")
            .limit(200) // we need to limit it somewhere, right?
            .get()
            .then(m => {
              m.forEach(s => {
                const measurementData = s.data();
                result.push({
                  date: formatDate(measurementData.date),
                  exercise: measurementData.exercise.id, // TODO perhaps it's better to not reference a doc, but use a constant and keep the logic in the app
                  score: measurementData.score,
                  official: measurementData.official ? "☑️" : ""
                });
              });
              this.measurements = result
            });
      },
      filterExercise() {
        const options = ["Alle oefeningen", "dribbling", "juggling"];
        action({
          title: "Kies een oefening",
          actions: options
        }).then(picked => {
          console.log("Picked option: " + picked);
          if (picked) {
            this.exercise = picked;
            // TODO
            // this.fetchMeasurements(picked)
          }
        });
      }
    }
  };
</script>

<style scoped>
  .scoreTable Label {
    font-size: 11;
  }
</style>