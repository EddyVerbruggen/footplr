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
             v-if="hasBirthDate"
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
    <Profile v-if="!hasBirthDate" ref="profile"></Profile>
  </Page>
</template>

<script>
  import * as platformModule from "tns-core-modules/platform"
  import routes from "~/router";
  import Measurements from "./components/measurements/Measurements.vue"
  import Profile from "./components/profile/Profile.vue"
  import ScoreCard from "./components/scorecard/ScoreCard.vue"
  import {setScreenName} from "~/utils/analytics-util";
  import {tapticSelection} from "~/utils/taptic-util";

  export default {
    components: {
      Measurements,
      Profile,
      ScoreCard
    },

    props: ['loadProfileTab'],

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
        tabIndex: this.loadProfileTab ? 2 : 1, // the initial tab
        tabView: undefined, // set below
        // logoSrc: "~/assets/images/fpr-logo-128.png",
        hasBirthDate: this.$authService.userWrapper.user.birthdate,
      };
    },

    methods: {
      onSelectedTabIndexChanged(event) {
        this.tabIndex = event.newIndex;
        if (this.tabIndex === 0) {
          setScreenName("scorecard");
        } else if (this.tabIndex === 1) {
          setScreenName("measurements");
        } else if (this.tabIndex === 2) {
          setScreenName("profile");
        }
        tapticSelection();
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
