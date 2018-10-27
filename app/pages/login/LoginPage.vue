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
// import * as enums from "tns-core-modules/ui/enums";

export default {
  components: {
    LoginMain
  },
  created() {
    console.log(">> login component created");
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
  },
  methods: {
    /*
    showMainContent: function() {
      this.$refs.logoContainer.nativeView
        .animate({
          translate: { x: 0, y: platformModule.isAndroid ? -70 : -50 },
          duration: 500,
          curve: enums.AnimationCurve.easeIn })
        .then(() => {
          this.state = 'main'
        })
    }
    */
  },
  mounted() {
    // this.state = 'main'
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