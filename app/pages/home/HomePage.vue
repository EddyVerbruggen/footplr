<template>
  <Page class="grass-background">
    <ActionBar title="" flat="true">
      <ActionItem @tap="onTapShare" icon="res://scorekaart" ios.position="left" android.position="actionBar" v-show="tabIndex === 0"/>

      <!--<GridLayout columns="*, 6, *" width="100%" backgroundColor="red" horizontalAlignment="center">-->
        <Img col="0" src="~/assets/images/fpr-logo-128.png" width="26" height="26" style="padding: 4; margin-bottom: 8" horizontalAlignment="right"/>
        <!--<Label col="2" text=" fpr" class="title bold" horizontalAlignment="left"/>-->
      <!--</GridLayout>-->

      <!--<StackLayout orientation="horizontal">-->
        <!--<Label text="officieel" style="font-size: 12" class="m-r-4"></Label>-->
        <!--<Switch height="20" width="30" style="font-size: 8"></Switch>-->
      <!--</StackLayout>-->
      <ActionItem @tap="onTapShare" ios.systemIcon="9" ios.position="right" android.systemIcon="ic_menu_share" android.position="actionBar" v-show="tabIndex === 0"/>
    </ActionBar>

    <TabView androidTabsPosition="bottom"
             android:tabBackgroundColor="#d6f0eb"
             android:tabTextColor="#999999"
             selectedTabTextColor="#2EC4B6"
             iosIconRenderingMode="automatic"
             :selectedIndex="tabIndex"
             backgroundColor="#FDFFFC"
             @selectedIndexChanged="onSelectedIndexChanged"
             @loaded="onTabViewLoaded">

      <TabViewItem textTransform="none" iconSource="res://scorekaart">
        <ScoreCard ref="scoreCard" :visible="tabIndex === 1"></ScoreCard>
      </TabViewItem>

      <TabViewItem textTransform="none" iconSource="res://graph">
        <Measurements ref="measurements" :visible="tabIndex === 2"></Measurements>
      </TabViewItem>

      <TabViewItem textTransform="none" iconSource="res://stopwatch">
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
