<template>
  <Page actionBarHidden="true" backgroundSpanUnderStatusBar="false">
    <GridLayout rows="*, auto, auto" columns="*, *">

      <Pager row="0" colSpan="2" height="100%" verticalAlignment="bottom" for="item in items" v-model="pagerIndex">
        <v-template>
          <GridLayout class="pager-item" rows="auto, auto" columns="*" width="75%" verticalAlignment="center">
            <Image row="0" :src="item.image" width="75%" class="m-t-30"></Image>
            <Label row="1" class="pager-text m-t-20 m-b-24" :text="item.text" textWrap="true"></Label>
          </GridLayout>
        </v-template>
      </Pager>

      <StackLayout row="1" colSpan="2" orientation="horizontal" class="m-b-30" horizontalAlignment="center">
        <Label class="pager-indicator" v-bind:class="{ 'pager-indicator-active' : index === pagerIndex }" v-for="(item, index) in items"></Label>
      </StackLayout>

      <Button row="2" col="0" text="OVERSLAAN" class="btn btn-secondary" @tap="$navigateTo(loginPage)"></Button>
      <Button row="2" col="1" :text="pagerIndex === items.length - 1 ? 'REGISTREREN': 'VOLGENDE'" class="btn btn-primary" @tap="pagerIndex === items.length - 1 ? $navigateTo(loginPage) : pagerIndex = pagerIndex + 1"></Button>

    </GridLayout>
  </Page>
</template>

<script>
  import routes from "~/router";
  import LoginPage from "../login/LoginPage.vue"
  import Vue from "nativescript-vue"
  import Pager from "nativescript-pager/vue"

  Vue.use(Pager);

  export default {
    components: {},
    created() {
      console.log("Onboarding created");
    },
    data() {
      return {
        loginPage: LoginPage,
        pagerIndex: 0,
        items: [
          {
            image: "~/assets/images/fpr-logo-full.png",
            text: "Ontwikkel je eigen voetbal kwaliteiten en word een echte profvoetballer"
          },
          {
            image: "~/assets/images/fpr-logo-full.png",
            text: "Flubberdeflop en dibberdedab, samen staan we slapperdeflap!"
          },
          {
            image: "~/assets/images/fpr-logo-full.png",
            text: "Bas is gek, Tim is gek, Eddy is helemaal niet gek. Mark dan weer wel."
          }
        ]
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
  Label.pager-text {
    vertical-align: center;
    text-align: center;
    color: #011627;
    line-height: 9;
  }

  Label.pager-indicator {
    background-color: #f3c0bf;
    border-color: #f3c0bf;
    border-radius: 3;
    border-width: 1;
    width: 6;
    height: 6;
    margin: 20 5;
  }

  Label.pager-indicator.pager-indicator-active {
    background-color: #e7605a;
    border-color: #e7605a;
  }
</style>
