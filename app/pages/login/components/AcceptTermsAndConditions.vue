<template>
  <Page>
    <GridLayout rows="*, auto" verticalAlignment="top" height="100%">
      <PDFView row="0" height="100%" width="100%" src="https://www.footballplayerratings.nl/wp-content/uploads/2019/11/algemene-voorwaarden-voor-apps-1572692335.pdf" verticalAlignment="top"></PDFView>
      <Button row="1" text="IK ACCEPTEER DEZE VOORWAARDEN" textWrap="true" class="btn btn-secondary" verticalAlignment="bottom" @tap="$modal.close()"></Button>
    </GridLayout>
  </Page>
</template>

<script lang="ts">
  // import Vue from "nativescript-vue"
  import { setScreenName } from "~/utils/analytics-util";

  export default {
    created() {
      setScreenName(`terms`);
    }
  }
</script>

<style scoped>
</style>
