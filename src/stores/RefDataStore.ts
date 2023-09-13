import { defineStore } from "pinia";
import { ref } from "vue";
export const useRefDataStore = defineStore("RefData", {
  state: () => ({
    errorListVisible: ref<boolean>(false),
    stepsDrawer: ref<boolean>(false),
  }),
  actions: {
    showJson(EVENTDATE, TRACKNAME, TYPE, ID) {
      const [year, month, day] = EVENTDATE.split("-");
      const url =
        "http://" +
        window.location.hostname +
        "/ROOT/LOGGING/YEAR[YEAR='" +
        year +
        "']/MONTH[MONTH='" +
        month +
        "']/DAY[DAY='" +
        day +
        "']/EVENT[ID='" +
        TRACKNAME +
        "']/TYPE[ID='" +
        TYPE +
        "']/MEDIA[ID='" +
        ID +
        "']?type=copy";
      window.open(url, "_blank");
    },
  },
});
