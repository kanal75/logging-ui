import { defineStore } from "pinia";
import { ref } from "vue";

export interface MediaItem {
  ID: string;
  NAME: string;
  DURATION: string;
  TYPE: string;
  TRACKNAME: string;
  RACENR?: string;
  HORSENR?: string;
  EVENTDATE: string;
  TAG?: string | string[];
  TEXT?: string;
  URL: string;
  State: string;
  Duration: string;
  StartTime: string;
  EndTime?: string;
  ClusterId?: string;
}

export const useMediaStore = defineStore("media", () => {
  const mediaList = ref<Array<MediaItem>>([
    {
      ID: "HORSE_2023-06-12_26_7_3_20230612151456",
      NAME: "HORSE_2023-06-12_26_7_3",
      DURATION: "00:00:13:10",
      TYPE: "Värmning",
      TRACKNAME: "Solänget",
      EVENTDATE: "2023-06-12",
      RACENR: "7",
      HORSENR: "3",
      TAG: "EJ WEB",
      URL: "http://10.200.32.118/processengine/processes/93",
      State: "DONE",
      Duration: "00:00:00,401",
      StartTime: "2023-06-12 15:15:02,708",
    },
    {
      ID: "HORSE_2023-06-12_26_7_4_20230612151519",
      NAME: "HORSE_2023-06-12_26_7_4",
      DURATION: "00:00:06:07",
      TYPE: "Värmning",
      TRACKNAME: "Solänget",
      EVENTDATE: "2023-06-12",
      RACENR: "7",
      HORSENR: "4",
      TAG: "EJ WEB",
      URL: "http://10.200.32.118/processengine/processes/94",
      State: "DONE",
      Duration: "00:00:00,262",
      StartTime: "2023-06-12 15:15:25,499",
    },
    {
      ID: "HORSE_2023-06-12_26_7_10_20230612151539",
      NAME: "HORSE_2023-06-12_26_7_10",
      DURATION: "00:00:06:11",
      TYPE: "Värmning",
      TRACKNAME: "Solänget",
      EVENTDATE: "2023-06-12",
      RACENR: "7",
      HORSENR: "10",
      TAG: "EJ WEB",
      URL: "http://10.200.32.118/processengine/processes/96",
      State: "DONE",
      Duration: "00:00:00,246",
      StartTime: "2023-06-12 15:15:45,437",
    },
    {
      ID: "HORSE_2023-06-12_26_7_2_20230612155436",
      NAME: "HORSE_2023-06-12_26_7_2",
      DURATION: "00:00:10:00",
      TYPE: "Värmning",
      TRACKNAME: "Solänget",
      EVENTDATE: "2023-06-12",
      RACENR: "7",
      HORSENR: "2",
      TEXT: "peter test",
      URL: "http://10.200.32.118/processengine/processes/100",
      State: "DONE",
      Duration: "00:00:00,326",
      StartTime: "2023-06-12 15:54:43,171",
      TAG: ["EJ ARKIV", "EJ WEB"],
    },
  ]);
  const draggedMedia = ref<any | null>(null);
  return {
    mediaList,
    draggedMedia,
  };
});
