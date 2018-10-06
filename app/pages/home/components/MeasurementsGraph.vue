<template>
  <GridLayout rows="auto, *" colums="*" verticalAlignment="top" height="100%" :visibility="selectedListOrGraphIndex === 1 ? 'visible' : 'collapse'">
    <!--<Label row="0" text="filter by exercises / timespan here.."></Label>-->
    <WebView row="1" :src="webViewSRC"></WebView>
  </GridLayout>
</template>

<script>
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
    webViewHeight: 200,
    xAxisCategories: Array.from(amountPerHourFull.keys()),
    series
  };

  export default {
    created() {
      console.log("MeasurementsGraph created");
      // authService.anyPageCallback = () => this.fetchMeasurements(this.exercise);
    },

    data() {
      return {
        webViewSRC: `~/assets/graph-chartjs.html?${JSON.stringify(data)}`
      }
    }
  };
</script>
