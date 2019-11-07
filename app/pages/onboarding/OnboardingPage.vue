<template>
  <Page actionBarHidden="true" backgroundSpanUnderStatusBar="false">
    <GridLayout rows="*, auto, auto" columns="*, *">

      <Pager row="0" colSpan="2" width="100%" height="100%" horizontalAlignment="center" verticalAlignment="center" for="item in items" v-model="pagerIndex">
        <v-template>
          <GridLayout class="pager-item" height="100%" rows="auto, *" columns="*" width="100%" verticalAlignment="center">
            <Img row="0" :src="item.image" height="80%" width="70%" class="m-t-30" verticalAlignment="center"></Img>
            <Label row="1" class="pager-text m-y-10" :text="item.text" textWrap="true" verticalAlignment="bottom"></Label>
          </GridLayout>
        </v-template>
      </Pager>

      <StackLayout row="1" colSpan="2" orientation="horizontal" class="m-b-30" horizontalAlignment="center" verticalAlignment="bottom">
        <Label class="pager-indicator" v-bind:class="{ 'pager-indicator-active' : index === pagerIndex }" v-for="(item, index) in items"></Label>
      </StackLayout>

      <Button row="2" col="0" text="OVERSLAAN" class="btn btn-secondary" @tap="$navigateTo(loginPage)"></Button>
      <Button row="2" col="1" :text="pagerIndex === items.length - 1 ? 'REGISTREREN': 'VOLGENDE'" class="btn btn-primary" @tap="pagerIndex === items.length - 1 ? $navigateTo(loginPage) : pagerIndex = pagerIndex + 1"></Button>

    </GridLayout>
  </Page>
</template>

<script lang="ts">
  import Pager from "nativescript-pager/vue";
  import Vue from "nativescript-vue";
  import { setScreenName } from "~/utils/analytics-util";
  import LoginPage from "../login/LoginPage.vue";

  (<any>Vue).use(Pager);

  export default {
    components: {},

    created() {
      setScreenName("onboarding");
    },

    data() {
      return {
        loginPage: LoginPage,
        pagerIndex: 0,
        items: [
          {
            image: "~/assets/images/onboarding/onboarding01.png",
            text: "Maak nu je eigen FPR spelerskaart"
          },
          {
            image: "~/assets/images/onboarding/onboarding02.png",
            text: "Test je skills"
          },
          {
            image: "~/assets/images/onboarding/onboarding03.png",
            text: "Houd ze bij en check je vooruitgang"
          }
        ]
      };
    }
  };
</script>

<style scoped>
  Label.pager-text {
    vertical-align: bottom;
    text-align: center;
    color: #011627;
    font-size: 17;
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
