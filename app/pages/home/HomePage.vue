<template>
  <Page :class="pageClasses" actionBarHidden="true" backgroundSpanUnderStatusBar="true">
    <!-- note that 'androidSelectedTabHighlightColor' is the line below the selected tab -->
    <TabView androidTabsPosition="bottom"
             androidSelectedTabHighlightColor="#ffffff"
             tabTextColor="white"
             selectedTabTextColor="white"
             iosIconRenderingMode="alwaysTemplate"
             tabBackgroundColor="#20284d"
             :selectedIndex="tabIndex"
             @selectedIndexChanged="onSelectedTabIndexChanged">

      <TabViewItem textTransform="none" iconSource="res://badge">
        <ScoreCard ref="scoreCard" :visible="tabIndex === 1"></ScoreCard>
      </TabViewItem>

      <!-- would be cool to add a 'shield' indicating how many exercises are not yet measured / 'expired' -->
      <TabViewItem textTransform="none" iconSource="res://graph">
        <Measurements ref="measurements" :visible="tabIndex === 2"></Measurements>
      </TabViewItem>

      <TabViewItem textTransform="none" iconSource="res://profile">
        <Profile ref="profile" :visible="tabIndex === 3"></Profile>
      </TabViewItem>
    </TabView>
  </Page>
</template>

<script>
  import * as platformModule from "tns-core-modules/platform"
  import routes from "~/router";
  import Measurements from "./components/measurements/Measurements.vue"
  import Profile from "./components/profile/Profile.vue"
  import ScoreCard from "./components/scorecard/ScoreCard.vue"

  export default {
    components: {
      Measurements,
      Profile,
      ScoreCard
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
    data() {
      return {
        tabIndex: 1, // setting this initially makes dev a little easier
        tabView: undefined, // set below
        logoSrc: "~/assets/images/fpr-logo-128.png"
      };
    },
    methods: {
      onSelectedTabIndexChanged(event) {
        this.tabIndex = event.newIndex;
      },
      onTapShare() {
        console.log("TODO: share.. but we're logging out for now.");
        this.$authService.logout().then(() => {
          this.$navigateTo(routes.login, {
            clearHistory: true,
            transition: {
              name: "fade"
            }
          });
        });
      },
    }
  };
</script>

<style scoped>
  TabView {
    font-size: 12;
  }
</style>
