<template>
    <Page class="grass-background">
        <ActionBar title="" flat="false">
            <GridLayout columns="*, 6, *" width="100%" horizontalAlignment="center" style="padding-right: 54">
                <Img col="0" src="~/assets/images/botafogo.png" width="24" height="24" horizontalAlignment="right" style="opacity: 0.9"/>
                <Label col="2" text="footplr" class="title bold" horizontalAlignment="left"/>
            </GridLayout>

            <ActionItem @tap="onTapShare" ios.systemIcon="9" ios.position="right" android.systemIcon="ic_menu_share" android.position="actionBar" v-show="tabIndex === 1" />
        </ActionBar>

        <TabView androidTabsPosition="bottom"
                 android:tabBackgroundColor="#d6f0eb"
                 android:tabTextColor="#999999"
                 selectedTabTextColor="#332D15"
                 iosIconRenderingMode="automatic"
                 :selectedIndex="tabIndex"
                 @selectedIndexChanged="onSelectedIndexChanged"
                 @loaded="onTabViewLoaded">

            <TabViewItem textTransform="none" title="meten"  iconSource="res://truck1">
                <GridLayout colums="*" rows="*" @loaded="onTab1Loaded">
                    <Label class="message" :text="tab1Msg" col="0" row="0"/>
                </GridLayout>
            </TabViewItem>

            <TabViewItem textTransform="none" title="score" iconSource="res://truck3">
                <Shimmer :enabled="shimmerEnabled">
                  <GridLayout colums="*" rows="*" @loaded="onScoreTabLoaded">
                      <Image src="~/assets/images/rating.png" height="74%" style="opacity: 0.9"/>
                      <!-- club logo (for participating clubs), or our logo (for non-participating clubs) -->
                      <Image src="~/assets/images/botafogo.png" height="10%" style="margin-bottom: 15.5%; opacity: 0.2" verticalAlignment="bottom"/>
                      <GridLayout rows="16*, 13*" columns="2*, 2*, *, 2*" height="74%" style="margin-bottom: 9%" horizontalAlignment="center">
                          <StackLayout colSpan="2" verticalAlignment="center">
                            <Label text="94" class="card-score" horizontalAlignment="center" verticalAlignment="center"/>
                            <Label :text="playerPosition" class="card-role" horizontalAlignment="center" @tap="selectRole"/>
                            <Image src="~/assets/images/botafogo.png" width="50" class="card-club" verticalAlignment="top"/>
                          </StackLayout>
                          <StackLayout col="0" colSpan="4" horizontalAlignment="center" class="card-photo" @tap="selectImage">
                            <Img src="~/assets/images/messi.jpg"/>
                          </StackLayout>

                          <GridLayout row="1" colSpan="4" rows="2*, 2*, 2*, 2*, 3*" columns="2*, 2*, *, 2*" width="100%" horizontalAlignment="center">
                              <StackLayout row="0" colSpan="5" horizontalAlignment="center" orientation="horizontal">
                                <Label :text="playerName" class="card-name bold" />
                                <StackLayout style="margin-left: 14" verticalAlignment="center">
                                  <Label :text="playerAgeYears" class="card-age-years"  horizontalAlignment="right"/>
                                  <Label :text="playerAgeMonths" class="card-age-months"  horizontalAlignment="right"/>
                                </StackLayout>
                              </StackLayout>

                              <Label row="1" col="0" text="93" class="card-item-score bold" horizontalAlignment="right"/>
                              <Label row="1" col="1" text="PAC" class="card-item-name" horizontalAlignment="left"/>
                              <Label row="1" col="2" text="98" class="card-item-score bold" horizontalAlignment="right"/>
                              <Label row="1" col="3" text="DRI" class="card-item-name" horizontalAlignment="left"/>

                              <Label row="2" col="0" text="99" class="card-item-score bold" horizontalAlignment="right"/>
                              <Label row="2" col="1" text="SHO" class="card-item-name" horizontalAlignment="left"/>
                              <Label row="2" col="2" text="97" class="card-item-score bold" horizontalAlignment="right"/>
                              <Label row="2" col="3" text="DEF" class="card-item-name" horizontalAlignment="left"/>

                              <Label row="3" col="0" text="92" class="card-item-score bold" horizontalAlignment="right"/>
                              <Label row="3" col="1" text="PAS" class="card-item-name" horizontalAlignment="left"/>
                              <Label row="3" col="2" text="91" class="card-item-score bold" horizontalAlignment="right"/>
                              <Label row="3" col="3" text="PHY" class="card-item-name" horizontalAlignment="left"/>
                          </GridLayout>
                      </GridLayout>
                  </GridLayout>
                </Shimmer>
            </TabViewItem>

            <TabViewItem textTransform="none" title="oefenen" iconSource="res://truck2">
                <GridLayout rows="*" colums="*" @loaded="onTab2Loaded" verticalAlignment="center">
                    <StackLayout>
                        <Label class="message" text="Content hiero.." col="0" row="0"/>
                        <Button @tap="goToTab(0)" text="Ga naar de eerste tab"/>
                    </StackLayout>
                </GridLayout>
            </TabViewItem>

        </TabView>
    </Page>
</template>

<script>
import routes from "../router";
import { backendService, authService } from "../main";
import { getYearsSince, getMonthsSince } from "../utils/date-util";
import { action } from "tns-core-modules/ui/dialogs";
import firebase from "nativescript-plugin-firebase";

export default {
  created() {
    console.log("App created");
  },
  data() {
    console.log(">>> backendService.user: " + backendService.user);
    console.log(">>> backendService.user.player: " + backendService.user.player);
    const player = backendService.user.player;
    const birthdate = new Date(player.birthdate);
    return {
      playerPosition: player.position,
      playerName: player.firstname + " " + player.lastname,
      playerAgeYears: getYearsSince(birthdate) + " jaar",
      playerAgeMonths: getMonthsSince(birthdate) + " maanden",
      tab1Msg: "Hello World 😬😬😬",
      shimmerEnabled: false,
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
    onTab1Loaded() {
      console.log("Loaded tab 1");
    },
    onTab2Loaded() {
      console.log("Loaded tab 2");
    },
    onScoreTabLoaded() {
      console.log("Score tab loaded @ " + new Date().getTime());
      setTimeout(this.shimmer, 300);
    },
    goToTab(tabNr) {
      this.tabView.selectedIndex = tabNr;
    },
    onTapShare() {
      console.log("TODO: share.. but we're logging out for now.");
      this.$authService.logout().then(() => {
        console.log(">>>> logged out ;)");
        this.$navigateTo(routes.login, { clearHistory: true });
      });
    },
    shimmer() {
      this.shimmerEnabled = true;
      setTimeout(() => (this.shimmerEnabled = false), 300);
    },
    selectImage() {
      console.log("TODO: pick image and store in Firebase");
    },
    selectRole() {
      console.log("TODO: pick role and store in Firebase");
      const options = ["GK", "CM"];
      action({
        title: "Op welke positie speel je?",
        actions: options
      }).then(picked => {
        console.log("Picked option: " + picked);
        if (picked) {
          this.playerPosition = picked;
          authService
            .updatePlayerDataInFirebase({
              position: picked
            })
            .then(() => console.log("Updated!"));
        }
      });
    }
  }
};
</script>

<style scoped>
Page {
  /* font-family: "Source Sans Pro", SourceSansPro-Regular, system, sans-serif; */
  font-family: "Core Sans D 35 Regular", CoreSansD35Regular, system, sans-serif;
  background-color: #998225;
  margin: 0;
  padding: 0;
  color: #332d15;
}

.bold {
  font-family: "Core Sans D 55 Bold", CoreSansD55Bold, system, sans-serif;
}

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

.p-40 {
  padding: 40;
}

.card-score {
  margin-top: 32%;
  font-size: 50;
}

.card-role {
  font-size: 25;
  margin-top: -15;
}

.card-club {
  margin-top: 5%;
  opacity: 0.5;
}

.card-photo {
  margin-left: 19%;
  margin-top: 5%;
  border-width: 6;
  border-color: #998225;
  width: 120;
  height: 120;
  border-radius: 60;
}

.card-name {
  font-size: 24;
  letter-spacing: -0.05;
}

.card-age-years {
  font-size: 14;
  letter-spacing: -0.05;
}

.card-age-months {
  font-size: 10;
  letter-spacing: -0.05;
}

.card-item-score {
  font-size: 22;
  padding-right: 6;
}

.card-item-name {
  font-size: 22;
  letter-spacing: -0.05;
}
</style>
