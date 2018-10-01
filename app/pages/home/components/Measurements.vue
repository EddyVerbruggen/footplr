<template>
  <StackLayout>

    <SegmentedBar row="0" style="margin: 10" width="80%" height="30" color="white" borderWidth="1" borderRadius="4" borderColor="darkgreen" backgroundColor="green" selectedBackgroundColor="darkgreen" v-model="selectedListOrGraphIndex">
      <SegmentedBarItem title="Lijst"/>
      <SegmentedBarItem title="Grafiek"/>
    </SegmentedBar>

    <GridLayout rows="auto, auto, *, auto" colums="*" verticalAlignment="top" height="100%" :visibility="selectedListOrGraphIndex === 0 ? 'visible' : 'collapse'">
      <GridLayout row="1" columns="*, *, *">
        <Label col="0" text="Datum" class="bold"/>
        <Label col="1" text="Oefening" class="bold"/>
        <Label col="2" text="Score" class="bold"/>
      </GridLayout>

      <ListView row="2" :items="measurements" @itemTap="onItemTap">
        <v-template>
          <GridLayout columns="*, *, *">
            <Label col="0" :text="item.date"/>
            <Label col="1" :text="item.exercise"/>
            <Label col="2" :text="item.score"/>
          </GridLayout>
        </v-template>
      </ListView>

      <Button row="3" @tap="add()" text="Toevoegen!"/>
    </GridLayout>

  </StackLayout>
</template>

<script>
  const measurements = [{date: "19 jun 2018", exercise: "Hooghouden", score:25}];

  setTimeout(() => {
    measurements.push({date: "18 mei 2018", exercise: "Hooghouden", score:20});
  }, 2000);

  export default {
    created() {
      console.log("Measurements created");
    },
    data() {
      return {
        selectedListOrGraphIndex: 0,
        measurements,
      }
    },
    methods: {
      add() {
        console.log("add..");
      }
    }
  };
</script>

<style scoped>
</style>