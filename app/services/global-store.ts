import Vue from "nativescript-vue"
const v = <any>Vue;

interface GlobalStoreData {
  mode: "OFFICIAL" | "UNOFFICIAL"
}

export const GlobalStore = new v({
  data: <GlobalStoreData>{
    mode: "OFFICIAL"
  },
  computed: {
    isOfficial: function () {
      return this.mode === "OFFICIAL"
    }
  }
});