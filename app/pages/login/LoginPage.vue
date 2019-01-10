<template>
  <Page ref="page" :class="pageClasses" actionBarHidden="true" backgroundSpanUnderStatusBar="true">
    <GridLayout class='login'>
      <LoginMain ref="loginMain"></LoginMain>
    </GridLayout>
  </Page>
</template>

<script>
  import * as platformModule from "tns-core-modules/platform"
  import LoginMain from "./components/LoginMain.vue"
  import {setScreenName} from "~/utils/analytics-util";
  // import * as enums from "tns-core-modules/ui/enums";

  export default {
    components: {
      LoginMain
    },

    created() {
      setScreenName("login");
    },

    data() {
      return {
        state: 'initial'
      }
    },

    computed: {
      pageClasses: function () {
        return {
          // add top class so we can apply styles to specific platforms
          'platform-ios': platformModule.isIOS,
          'platform-android': platformModule.isAndroid
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .login {
    .logo-container {
      horizontal-align: center;
      height: 80;
    }
  }
</style>