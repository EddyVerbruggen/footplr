<template>
  <Page class="grass-background" actionBarHidden="true" backgroundSpanUnderStatusBar="true">
    <!--ActionBar title="" flat="true" DISABLED-backgroundColor="#011627">
      <ActionItem @tap="onTapShare" icon="res://scorekaart" ios.position="left" android.position="actionBar" v-show="tabIndex === 0"/>
      <Label style="font-size: 14" text="vv Hoogland JO9-7" horizontalAlignment="center"/>
      <ActionItem @tap="onTapShare" ios.systemIcon="9" ios.position="right" android.systemIcon="ic_menu_share" android.position="actionBar" v-show="tabIndex === 1"/>
    </ActionBar-->

    <!-- note that 'androidSelectedTabHighlightColor' is the line below the selected tab -->
    <TabView androidTabsPosition="bottom"
             androidSelectedTabHighlightColor="#ffffff"
             tabTextColor="white"
             selectedTabTextColor="white"
             iosIconRenderingMode="alwaysTemplate"
             tabBackgroundColor="#20284d"
             :selectedIndex="tabIndex"
             @selectedIndexChanged="onSelectedIndexChanged"
             @loaded="onTabViewLoaded">

      <TabViewItem textTransform="none" iconSource="res://badge">
        <ScoreCard ref="scoreCard" :visible="tabIndex === 1"></ScoreCard>
      </TabViewItem>

      <!-- would be cool to add a 'shield' indicating how many exercises are not yet measured / 'expired' -->
      <TabViewItem textTransform="none" iconSource="res://graph">
        <Measurements ref="measurements" :visible="tabIndex === 2"></Measurements>
      </TabViewItem>

      <TabViewItem textTransform="none" iconSource="res://profile">
        <GridLayout rows="*" columns="*" @loaded="onTab3Loaded" verticalAlignment="center">
          <StackLayout>
            <Label class="message" :text="tab1Msg"/>
            <Button @tap="goToTab(0)" text="Ga naar de scorekaart"/>
          </StackLayout>
        </GridLayout>
      </TabViewItem>
    </TabView>
  </Page>
</template>

<script>
  import routes from "~/router";
  import Measurements from "./components/Measurements.vue"
  import ScoreCard from "./components/ScoreCard.vue"

  export default {
    components: {
      Measurements,
      ScoreCard
    },
    created() {
      console.log("HomePage created");
    },
    data() {
      return {
        tab1Msg: "Team pagina hier? 🎳",
        tabIndex: 1, // setting this initially makes dev a little easier
        tabView: undefined, // set below
        isOfficial: true,
        logoSrc: "~/assets/images/fpr-logo-128.png"
      };
    },
    methods: {
      onSelectedIndexChanged(event) {
        this.tabIndex = event.newIndex;
      },
      onTabViewLoaded(event) {
        const tabView = event.object;
        this.tabView = tabView;
      },
      onTab3Loaded() {
        console.log("Loaded tab 3");
      },
      goToTab(tabNr) {
        this.tabView.selectedIndex = tabNr;
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
      onTapToggleOfficial() {
        this.isOfficial = !this.isOfficial;
        this.logoSrc = this.isOfficial ? "~/assets/images/fpr-logo-128.png" : "~/assets/images/fpr-logo-128-gray.png";
      }
    }
  };
</script>

<style scoped>
  .grass-background {
    /*background-color: #FAEDCA;*/
    /*background-repeat: no-repeat;*/
    /*background-position: center;*/
    /*background-size: cover;*/
    /*background-image: ~/assets/images/grass.jpg;*/
  }

  TabView {
    font-size: 12;
  }

  ActionBar {
    /*background-color: #0b8c93;*/
    color: #20284d;
  }

  ActionBar .title {
    font-size: 18;
  }

  .message {
    vertical-align: center;
    text-align: center;
    font-size: 20;
    color: #20284d;
  }
</style>
