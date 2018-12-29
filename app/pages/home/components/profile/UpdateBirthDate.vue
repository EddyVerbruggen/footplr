<template>
  <Page>
    <GridLayout rows="auto, *, auto" columns="*, *" class="m-20" horizontalAlignment="center" height="95%">
      <Label row="0" colSpan="2" text="Op welke dag ben je geboren?" horizontalAlignment="center"></Label>

      <DatePicker row="1" colSpan="2" v-model="birthdate" :maxDate="maxDate"></DatePicker>

      <Button row="2" col="0" text="ANNULEREN" class="btn btn-secondary" @tap="$modal.close()"></Button>
      <Button row="2" col="1" text="OPSLAAN" class="btn btn-primary" @tap="done()"></Button>
    </GridLayout>
  </Page>
</template>

<script>
  import {authService} from "~/main";
  import {formatDate} from "~/utils/date-util";
  import {translateExerciseType} from "~/shared/exercises";

  export default {
    created() {
      console.log("UpdateBirthDate created");
    },

    // these have been passed to the modal and can be accessed as this.<property>
    props: ['birthdate'],

    data() {
      return {
        maxDate: new Date()
      }
    },

    methods: {
      done() {
        this.$modal.close(this.birthdate)
      }
    }
  };
</script>

<style scoped>
  Page {
    /*margin: 30 0 0 0;*/
  }
</style>
