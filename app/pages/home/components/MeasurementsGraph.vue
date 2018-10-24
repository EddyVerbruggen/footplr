<template>
  <GridLayout rows="auto, *" colums="*" verticalAlignment="top" height="100%" :visibility="selectedListOrGraphIndex === 1 ? 'visible' : 'collapse'">
    <!--<Label row="0" text="filter by exercises / timespan here.."></Label>-->
    <WebView row="1" :src="webViewSRC"></WebView>
  </GridLayout>
</template>

<script>
  const datasets = [
    {
      label: 'Bas',
      data: [10, 15, 20],
      fill: false,
      backgroundColor: [
        'rgba(75, 192, 192, 0.2)'
      ],
      borderColor: [
        'rgba(75, 192, 192, 1)'
      ],
      borderWidth: 2
    },
    {
      label: 'Mark',
      data: [12, 17, 14],
      fill: false,
      backgroundColor: [
        'rgba(255, 159, 64, 0.2)'
      ],
      borderColor: [
        'rgba(255, 159, 64, 1)'
      ],
      borderWidth: 2
    }
  ];

  const labels = [
    new Date().getTime() - (1000 * 60 * 60 * 24 * 30),
    new Date().getTime() - (1000 * 60 * 60 * 24 * 10),
    new Date().getTime() - (1000 * 60 * 60 * 24 * 5)
  ];

  const data = {
    datasets,
    labels
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
