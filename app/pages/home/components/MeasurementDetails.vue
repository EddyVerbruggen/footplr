<template>
  <Page>
    <GridLayout rows="auto, 190, auto, * auto" colums="*" verticalAlignment="top" height="100%">
      <!-- TODO add option to compare to others -->
      <Label row="0" :text="exerciseTranslated"></Label>
      <WebView row="1" height="100%" :src="webViewSRC"></WebView>

      <GridLayout row="2" columns="2*, *" class="scoreTable m-t-20" style="background-color: #CBE3F0">
        <Label col="0" text="Datum" class="m-l-10 p-y-10 p-x-5 bold"/>
        <Label col="2" text="Score" class=" p-y-10 p-x-5 bold" horizontalAlignment="right"/>
      </GridLayout>

      <ListView row="3" for="(item, index) in measurements" @itemTap="onItemTap" separatorColor="transparent" class="scoreTable">
        <v-template>
          <GridLayout columns="2*, *" xclass="listview-separator">
            <Label col="0" style="color: red" :text="item.date" xclass="m-l-10 p-y-10 p-x-5"/>
            <Label col="2" style="color: red" :text="item.score" xclass="p-y-10 p-x-5" horizontalAlignment="right"/>
          </GridLayout>
        </v-template>
      </ListView>

      <Button row="4" @tap="$modal.close('Bla')" text="Sluiten"/>
    </GridLayout>
  </Page>
</template>

<script>
  import {authService} from "~/main";
  import {formatDate} from "~/utils/date-util";
  import {translateExerciseType} from "~/shared/exercises";

  const measurements = [];

  export default {
    created() {
      console.log("MeasurementsGraph created");
      // authService.anyPageCallback = () => this.fetchMeasurements(this.exercise);
      this.fetchMeasurements(measurements);
    },

    // these have been passed to the modal and can be accessed as this.<property>
    props: ['exercise', 'exerciseTranslated'],

    data() {
      return {
        webViewSRC: undefined, // `~/assets/graph-chartjs.html?${JSON.stringify(data)}`,
        measurements
      }
    },
    methods: {
      fetchMeasurements(measurementList) {
        // let's empty the array first
        measurementList.splice(0);

        const data = [];
        const labels = [];

        authService.userRef
            .collection("measurements")
            .where("exercise", "==", this.exercise)
            .orderBy("date", "desc")
            .limit(200) // we need to limit it somewhere, right?
            .get()

            .then(m => {
              m.forEach(s => {
                const measurementData = s.data();
                measurementList.push({
                  date: formatDate(measurementData.date),
                  score: measurementData.score
                });
                data.push(measurementData.score);
                labels.push(measurementData.date.getTime())
              });

              // now render the graph
              const datasets = [{
                  label: '',
                  data: data,
                  fill: false,
                  backgroundColor: [
                    'rgba(75, 192, 192, 0.2)'
                  ],
                  borderColor: [
                    'rgba(75, 192, 192, 1)'
                  ],
                  borderWidth: 2
                }];

              this.webViewSRC = `~/assets/graph-chartjs.html?${JSON.stringify({datasets, labels})}`;
            })
            .catch(err => console.log(err));
      }
    }
  };
</script>

<style scoped>
  Page {
    margin: 30 0 20 0;
  }

  .scoreTable Label {
    font-size: 12;
  }
</style>