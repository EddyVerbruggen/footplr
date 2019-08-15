<template>
  <Page>
    <GridLayout rows="auto, auto, 230, auto, 2*, *" columns="auto, *" :class="'background-color-score-' + scoreClass"
                verticalAlignment="top" height="100%">
      <!-- TODO add option to compare to others -->

      <Image row="0" col="0" class="m-l-12 m-t-4" :src="'~/assets/images/exercises/' + exercise + '.png'" height="30"
             horizontalAlignment="left" verticalAlignment="top"></Image>
      <Label row="0" col="1" class="bold p-12 c-white" horizontalAlignment="right" :text="exerciseTranslated"></Label>

      <Label row="1" colSpan="2" :text="getMeasurementUnit()" backgroundColor="#ffffff"></Label>
      <Label row="1" colSpan="2" text="score" horizontalAlignment="right" backgroundColor="#ffffff"></Label>

      <WebView row="2" colSpan="2" height="100%" :src="webViewSRC" @loaded="webViewLoaded"></WebView>

      <!--<StackLayout row="2" class="c-bg-white"></StackLayout>-->

      <GridLayout row="3" colSpan="2" columns="50, 76, *, 100" class="table" style="background-color: #011627; color: #fff">
        <Label col="0" text="Score" class="m-l-10 p-y-10 bold" horizontalAlignment="center"></Label>
        <Label col="1" text="Meting" class="p-y-10 p-x-10 bold" horizontalAlignment="right"></Label>
        <Label col="2" text="Datum" class="p-y-10 p-x-5 bold"></Label>
      </GridLayout>

      <ListView row="4" colSpan="2" for="(item, index) in measurements" @itemTap="onItemTap"
                separatorColor="transparent" class="table c-bg-white">
        <v-template>
          <GridLayout columns="50, 76, *, 100" class="row" v-bind:class="index % 2 === 0 ? 'row-odd' : 'row-even'">
            <Label col="0" :text="item.score" :class="'background-color-score-' + item.scoreClass"
                   class="m-l-10 m-y-4 p-y-5 p-x-5 score bold" horizontalAlignment="center"></Label>
            <Label col="1" color="#011627" :text="item.measurement" class="p-y-10 p-x-10"
                   horizontalAlignment="right"></Label>
            <Label col="2" color="#011627" :text="item.date" class="p-y-10 p-x-5"></Label>
            <Label col="3" class="icon-round m-r-10" verticalAlignment="center" horizontalAlignment="right"
                   @tap="deleteMeasurement(item)"></Label>
            <!-- TODO only allow delete if you entered it yourself -->
            <Label col="3" :text="iconDelete" class="icon m-r-16 p-r-2" style="color: white; font-size: 18"
                   verticalAlignment="center" horizontalAlignment="right" @tap="deleteMeasurement(item)"></Label>
          </GridLayout>
        </v-template>
      </ListView>

      <StackLayout row="5" colSpan="2" class="c-bg-white" height="100%" verticalAlignment="bottom">
        <Button text="TERUG" class="btn btn-secondary" style="margin-right: 12" width="140" horizontalAlignment="right"
                @tap="$modal.close()"></Button>
      </StackLayout>
    </GridLayout>
  </Page>
</template>

<script lang="ts">
  import { authService, editingUserService } from "~/main";
  import { Excercises } from "~/shared/exercises";
  import { setScreenName } from "~/utils/analytics-util";
  import { formatDate } from "~/utils/date-util";

  const measurements = [];

  export default {
    created() {
      setScreenName(`measurement.details.${this.exercise}`);

      // editingUserService.anyPageCallback = () => this.fetchMeasurements(this.exercise);
      this.fetchMeasurements(measurements);
    },

    // these have been passed to the modal and can be accessed as this.<property>
    props: ['exercise', 'exerciseTranslated', 'scoreClass'],

    data() {
      return {
        isTrainer: authService.userWrapper.user.trains !== undefined,
        iconDelete: String.fromCharCode(0xe872),
        webViewSRC: undefined, // `~/assets/graph-chartjs.html?${JSON.stringify(data)}`,
        measurements
      }
    },
    methods: {
      getMeasurementUnit() {
        const exercise = Excercises[this.exercise];
        return exercise.getScoreUnit();
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
        let highestMeasurement = 0;

        let q = editingUserService.userRef
            .collection("measurements")
            .where("exercise", "==", this.exercise);

        // for trainers, we only show official measurements
        if (this.isTrainer) {
          q = q.where("official", "==", true);
        }

        q.orderBy("date", "desc")
            .limit(100) // we need to limit it somewhere, right?
            .get()
            .then(m => {
              let index = 0;
              m.forEach(s => {
                const measurementData = s.data();
                const date = formatDate(measurementData.date);
                if (measurementData.measurement > highestMeasurement) {
                  highestMeasurement = measurementData.measurement;
                }
                measurementList.push({
                  id: index++,
                  ref: s.ref,
                  date,
                  measurement: measurementData.measurement,
                  score: measurementData.score,
                  scoreClass: (Math.ceil(measurementData.score / 10)) * 10
                });

                // only show this measurement in the graph if the previous measurement is not on the same date
                if (measurementList.length === 1 || date !== measurementList[measurementList.length - 2].date) {
                  data.push(measurementData.measurement);
                  labels.push(measurementData.date.getTime());
                }
              });

              // now render the graph, see http://www.chartjs.org/docs/latest/charts/line.html
              const datasets = [{
                label: editingUserService.userWrapper.user.firstname,
                data: data,
                fill: true,
                backgroundColor: [
                  'rgba(32, 40, 77, .1)'
                ],
                borderColor: [
                  'rgba(32, 40, 77, 1)'
                ],
                borderWidth: 2
              }];

              const exercise = Excercises[this.exercise];
              this.webViewSRC = `~/assets/graph-chartjs.html?${JSON.stringify({
                datasets,
                labels,
                reverseBounds: exercise.scoreCalculationType === "HIGH_LOW",
                bounds: {min: exercise.lowbound, max: Math.max(exercise.highbound, highestMeasurement)}
              })}`;
            })
            .catch(err => console.log(err));
      },

      webViewLoaded(args) {
        const webView = args.object;
        if (webView.android) {
          webView.android.getSettings().setDisplayZoomControls(false);
          webView.android.getSettings().setBuiltInZoomControls(false);
        } else {
          webView.ios.scrollView.scrollEnabled = false;
          webView.ios.scrollView.bounces = false;
        }
      }
    }
  }
</script>

<style scoped>
  .table Label {
    font-size: 12;
  }

  .table .score {
    color: #fff;
    width: 30;
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
