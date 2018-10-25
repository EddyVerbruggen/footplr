<template>
  <!--<StackLayout>-->

    <!--<SegmentedBar row="0" class="m-y-15" width="60%" height="28" color="#2EC4B6" borderWidth="1" borderRadius="4" borderColor="#2EC4B6" backgroundColor="#fdfffc" selectedBackgroundColor="#2EC4B6" v-model="selectedListOrGraphIndex">-->
      <!--<SegmentedBarItem title="Overzicht"/>-->
      <!--<SegmentedBarItem title="Grafiek"/>-->
      <!--<SegmentedBarItem title="Stream"/>-->
    <!--</SegmentedBar>-->

    <MeasurementsOverview ref="measurementsOverview" :visible="selectedListOrGraphIndex === 0" :visibility="selectedListOrGraphIndex === 0 ? 'visible' : 'collapse'"></MeasurementsOverview>
    <!--<MeasurementsGraph ref="measurementsGraph" :visible="selectedListOrGraphIndex === 1" :visibility="selectedListOrGraphIndex === 1 ? 'visible' : 'collapse'"></MeasurementsGraph>-->
    <!--<MeasurementsList ref="measurementsList" :visible="selectedListOrGraphIndex === 2" :visibility="selectedListOrGraphIndex === 2 ? 'visible' : 'collapse'"></MeasurementsList>-->

  <!--</StackLayout>-->
</template>

<script>
  import MeasurementsList from "./MeasurementsList.vue"
  import MeasurementsGraph from "./MeasurementsGraph.vue"
  import MeasurementsOverview from "./MeasurementsOverview.vue"
  import {formatDate} from "~/utils/date-util";
  import {action} from "tns-core-modules/ui/dialogs";

  export default {
    components: {
      MeasurementsList,
      MeasurementsGraph,
      MeasurementsOverview
    },

    created() {
      console.log("Measurements created");
      this.fetchMeasurements();
    },

    data() {
      return {
        exercise: "Alle oefeningen",
        player: undefined,
        selectedListOrGraphIndex: 0
      }
    },

    methods: {
      fetchMeasurements(filterExercise = undefined) {
        const result = [];
        let query = this.$authService.userRef.collection("measurements")
            .orderBy("date", "desc");

        if (filterExercise) {
          query = query.where("exercise", "==", filterExercise);
        }

        query
            .limit(200) // we need to limit it somewhere, right?
            .get()
            .then(m => {
              m.forEach(s => {
                const measurementData = s.data();
                result.push({
                  date: formatDate(measurementData.date),
                  exercise: measurementData.exercise, // TODO enum to nice name
                  score: measurementData.score,
                  official: measurementData.official ? "☑️" : ""
                });
              });
              this.measurements = result
            })
            .catch(err => console.log(err));
      },
      filterExercise() {
        const options = ["Alle oefeningen", "DRIBBLING", "JUGGLING"];
        action({
          title: "Kies een oefening",
          actions: options
        }).then(picked => {
          if (picked && picked !== this.exercise) {
            this.exercise = picked;
            this.fetchMeasurements(picked === "Alle oefeningen" ? undefined : picked)
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