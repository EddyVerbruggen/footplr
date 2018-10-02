<template>
  <StackLayout style="background-color: #fff" class="p-b-10">

    <SegmentedBar row="0" class="m-y-15" width="60%" height="28" color="#7EBC89" borderWidth="1" borderRadius="4" borderColor="#7EBC89" backgroundColor="#fff" selectedBackgroundColor="#7EBC89" v-model="selectedListOrGraphIndex">
      <SegmentedBarItem title="Lijst"/>
      <SegmentedBarItem title="Grafiek"/>
    </SegmentedBar>

    <!-- list -->
    <MeasurementsList ref="measurementsList" :visible="selectedListOrGraphIndex === 0" :visibility="selectedListOrGraphIndex === 0 ? 'visible' : 'collapse'"></MeasurementsList>

    <!-- graph, TODO extract -->
    <GridLayout rows="auto, *" colums="*" verticalAlignment="top" height="100%" :visibility="selectedListOrGraphIndex === 1 ? 'visible' : 'collapse'">
      <Label row="0" text="filter by exercises / timespan here.."></Label>
      <WebView row="1" :src="webViewSRC"></WebView>
    </GridLayout>

  </StackLayout>
</template>

<script>
  import MeasurementsList from "./MeasurementsList.vue"
  import {formatDate} from "~/utils/date-util";
  import {action} from "tns-core-modules/ui/dialogs";

  let amountPerHourFull = new Map();
  let amountPerHourFull2 = new Map();
  for (let i = 10; i <= 20; i++) {
    amountPerHourFull.set(i + ":00", 5 + i);
    amountPerHourFull2.set(i + ":00", 3 + i);
  }

  const series = [];

  series.push({
    type: "line",
    color: "purple",
    lineWidth: 3,
    name: "Dribbelen",
    data: Array.from(amountPerHourFull.values())
  });

  series.push({
    type: "line",
    color: "blue",
    lineWidth: 3,
    name: "Hooghouden",
    data: Array.from(amountPerHourFull2.values())
  });

  const data = {
    webViewHeight: 400,
    xAxisCategories: Array.from(amountPerHourFull.keys()),
    series
  };

  // console.log(`~/pages/home/components/graph.html?${JSON.stringify(data)}`);
  export default {
    components: {
      MeasurementsList,
    },

    created() {
      console.log("Measurements created");
      this.fetchMeasurements();
    },

    data() {
      return {
        webViewSRC: `~/assets/graph.html?${JSON.stringify(data)}`,
        exercise: "Alle oefeningen",
        player: undefined,
        selectedListOrGraphIndex: 0,
        getAuthService: this.$authService,
        getAuthService2: () => this.$authService
      }
    },

    methods: {
      fetchMeasurements(filterExercise = undefined) {
        const result = [];
        let query = this.getAuthService2().userRef.collection("measurements")
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