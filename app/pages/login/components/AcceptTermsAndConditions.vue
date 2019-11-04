<template>
  <Page>
    <GridLayout rows="*, auto" verticalAlignment="top" height="100%">
      <!-- TODO change to the actual terms -->
      <PDFView row="0" height="100%" width="100%" src="https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" verticalAlignment="top"></PDFView>
      <Button row="1" text="IK ACCEPTEER DEZE VOORWAARDEN" textWrap="true" class="btn btn-secondary" verticalAlignment="bottom" @tap="$modal.close()"></Button>
    </GridLayout>
  </Page>
</template>

<script lang="ts">
  // import Vue from "nativescript-vue"
  import { setScreenName } from "~/utils/analytics-util";

  export default {
    created() {
      // setScreenName(`terms`);
    }
  }
</script>

<style scoped>
</style>
