import Vue from "nativescript-vue"
const v = <any>Vue;

interface GlobalStoreData {
  mode: "OFFICIAL" | "UNOFFICIAL"
}

// note that we wanted to make this a global thing, but we currently only use this on the Score tab, so no real need for this construct..
export const GlobalStore = new v({
  data: <GlobalStoreData>{
    mode: "UNOFFICIAL"
  },
  computed: {
    isOfficial: function () {
      return this.mode === "OFFICIAL"
    }
  }
});