<template>
  <Page class="grass-background">
    <ActionBar title="" flat="false">
      <GridLayout columns="*, 6, *" width="100%" horizontalAlignment="center" style="padding-right: 54">
        <Img col="0" src="~/assets/images/botafogo.png" width="24" height="24" horizontalAlignment="right" style="opacity: 0.9"/>
        <Label col="2" text="footplr" class="title bold" horizontalAlignment="left"/>
      </GridLayout>

      <ActionItem @tap="onTapShare" ios.systemIcon="9" ios.position="right" android.systemIcon="ic_menu_share" android.position="actionBar" v-show="tabIndex === 0"/>
    </ActionBar>

    <TabView androidTabsPosition="bottom"
             android:tabBackgroundColor="#d6f0eb"
             android:tabTextColor="#999999"
             selectedTabTextColor="#332D15"
             iosIconRenderingMode="automatic"
             :selectedIndex="tabIndex"
             @selectedIndexChanged="onSelectedIndexChanged"
             @loaded="onTabViewLoaded">

      <TabViewItem textTransform="none" title="scorekaart" iconSource="res://truck2">
        <ScoreCard ref="scoreCard" :visible="tabIndex === 1"></ScoreCard>
      </TabViewItem>

      <TabViewItem textTransform="none" title="metingen" iconSource="res://truck3">
        <Measurements ref="measurements" :visible="tabIndex === 2"></Measurements>
      </TabViewItem>

      <TabViewItem textTransform="none" title="invoer" iconSource="res://truck1">
        <GridLayout rows="*" colums="*" @loaded="onTab3Loaded" verticalAlignment="center">
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
        tab1Msg: "Hello World 😬",
        tabIndex: 1, // setting this initially makes dev a little easier
        tabView: undefined // set below
      };
    },
    methods: {
      onSelectedIndexChanged(event) {
        this.tabIndex = event.newIndex;
      },
      onTabViewLoaded(event) {
        const tabView = event.object;
        this.tabView = tabView;
        console.log("onTabViewLoaded " + tabView);
      },
      onTab3Loaded() {
        console.log("Loaded tab 1");
      },
      goToTab(tabNr) {
        this.tabView.selectedIndex = tabNr;
      },
      onTapShare() {
        console.log("TODO: share.. but we're logging out for now.");
        this.$authService.logout().then(() => {
          console.log(">>>> logged out ;)");
          this.$navigateTo(routes.login, {clearHistory: true});
        });
      }
    }
  };
</script>

<style scoped>
  .grass-background {
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    background-image: ~/assets/images/grass.jpg;
  }

  TabView {
    font-size: 12;
  }

  ActionBar {
    background-color: #e8d170;
  }

  ActionBar .title {
    font-size: 18;
  }

  .message {
    vertical-align: center;
    text-align: center;
    font-size: 20;
    color: #333333;
  }
</style>
