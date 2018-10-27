<template>
  <Page>
    <GridLayout rows="auto, 190, auto, *, auto" colums="*" verticalAlignment="top" height="100%">
      <!-- TODO add option to compare to others -->
      <Label row="0" class="bold m-20" :text="exerciseTranslated"></Label>

      <WebView row="1" class="m-20" height="100%" :src="webViewSRC"></WebView>

      <GridLayout row="2" columns="50, *, 100" class="table m-t-20" style="background-color: #CBE3F0">
        <Label col="0" text="Score" class="m-l-10 p-y-10 bold" horizontalAlignment="center"/>
        <Label col="1" text="Datum" class="p-y-10 p-x-5 bold"/>
      </GridLayout>

      <ListView row="3" for="(item, index) in measurements" @itemTap="onItemTap" separatorColor="transparent" class="table">
        <v-template>
          <GridLayout columns="50, *, 100" class="row" v-bind:class="index % 2 === 0 ? 'row-odd' : 'row-even'">
            <Label col="0" :text="item.score" v-bind:class="item.getScoreClass()" class="m-l-10 m-y-4 p-y-5 p-x-5 score bold" horizontalAlignment="center"/>
            <Label col="1" :text="item.date" class="p-y-10 p-x-5"/>
            <StackLayout col="2" class="p-x-5 m-r-10" orientation="horizontal" horizontalAlignment="right">
              <Button text="✏️" class="edit-measurement" @tap="editMeasurement(item)"/>
              <Button text="🗑" class="delete-measurement" @tap="deleteMeasurement(item)"/>
            </StackLayout>
          </GridLayout>
        </v-template>
      </ListView>

      <Button row="4" @tap="$modal.close()" class="button-close" text="╳"/>
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
      editMeasurement(measurement) {
        // TODO send to prefilled AddMeasurement screen?
      },

      deleteMeasurement(measurement) {
        measurement.ref /* DocumentReference */
            .delete()
            .then(() => console.log("deleted"));

        // not calling fetchMeasurements (in the promise) for efficiency
        measurements.forEach((m, i) => {
          if (m.id === measurement.id) {
            measurements.splice(i, 1);
          }
        });

        // close the modal in case it was the last one
        if (measurements.length === 0) {
          setTimeout(() => this.$modal.close(), 200);
        } else {
          // we still need to update the webview, so to make it easy we simply fetch the measurements
          this.fetchMeasurements(measurements);
        }
      },

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
              let index = 0;
              m.forEach(s => {
                const measurementData = s.data();
                measurementList.push({
                  id: index++,
                  ref: s.ref,
                  date: formatDate(measurementData.date),
                  score: measurementData.score,
                  getScoreClass: () => {
                    // TODO extract to util class (dupe of overview page)
                    if (measurementData.score > 80) {
                      return 'c-bg-purple';
                    } else if (measurementData.score > 60) {
                      return 'c-bg-blue';
                    } else if (measurementData.score > 40) {
                      return 'c-bg-orange';
                    } else {
                      return 'c-bg-ruby';
                    }
                  }
                });
                data.push(measurementData.score);
                labels.push(measurementData.date.getTime())
              });

              // now render the graph
              const datasets = [{
                  label: authService.userWrapper.user.firstname,
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

  .table Label {
    font-size: 12;
  }

  .table .score {
    color: #fff;
    width: 26;
    text-align: center;
    border-radius: 3;
  }


  .table .edit-measurement {
    background-color: #e6e6e6;
    font-size: 12;
  }

  .table .delete-measurement {
    background-color: #b6b6b6;
    font-size: 12;
    margin-left: 8;
  }
</style>