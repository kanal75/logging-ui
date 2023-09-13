import { defineStore } from "pinia";
import axios from "axios";
import moment from "moment";
import { ref } from "vue";
import { message } from "ant-design-vue";
export const useRootStore = defineStore("RootStore", {
  state: () => ({
    days: ref([]),
    tracks: <[]>[],
    types: [],
    medias: [],
    nodes: ref([]),
    selectedDate: ref(""),
    selectedTrack: ref(""),
    selectedMedia: ref({
      ID: "",
      StartTime: "",
    }),
    selectedKeys: ref([0]),
    loading: ref(true),
  }),
  actions: {
    async fetchDays() {
      const url =
        "ROOT/LOGGING/YEAR/MONTH/DAY@DAY|,,/MONTH|,,/,,/YEAR?version=v2&type=copy";
      const { data } = await axios.get(
        process.env.NODE_ENV === "production"
          ? window.location.origin + "/" + url
          : "http://127.0.0.1/" + url
      );
      interface DateObject {
        YEAR: string;
        MONTH: string;
        DAY: string;
      }
      const dateStrings: string[] = data.map((date: DateObject) => {
        const year = date.YEAR;
        const month = date.MONTH;
        const day = date.DAY;
        return `${year}-${month}-${day}`;
      });
      dateStrings.sort((date1, date2) => {
        const date1Obj = new Date(date1);
        const date2Obj = new Date(date2);
        return date1Obj.getTime() - date2Obj.getTime();
      });

      const today = new Date().toISOString().slice(0, 10); // Get today's date in ISO format

      if (dateStrings.includes(today)) {
        this.selectedDate = today;
      } else {
        this.selectedDate = dateStrings[dateStrings.length - 1];
      }
      this.days = dateStrings;
      this.fetchTracks();
    },
    async fetchTracks() {
      const [year, month, day] = this.selectedDate.split("-");
      const url = `ROOT/LOGGING/YEAR[YEAR='${year}']/MONTH[MONTH='${month}']/DAY[DAY='${day}']/EVENT@ID?version=v2&type=copy`;
      const { data } = await axios.get(
        process.env.NODE_ENV === "production"
          ? window.location.origin + "/" + url
          : "http://127.0.0.1/" + url
      );
      this.tracks = [{ ID: "All" }, ...data];
      this.selectedTrack = this.tracks[0].ID;
      this.fetchTypes();
      this.selectedKeys = [0];
    },
    async fetchTypes() {
      const [year, month, day] = this.selectedDate.split("-");
      let url =
        "ROOT/LOGGING/YEAR[YEAR='" +
        year +
        "']/MONTH[MONTH='" +
        month +
        "']/DAY[DAY='" +
        day +
        "']/EVENT";
      if (this.selectedTrack !== "All") {
        url += "[ID='" + this.selectedTrack + "']";
      }
      url +=
        "/TYPE@ID?version=v2&type=copy&uniqepath=ID&sort=ID&sortorder=ascending&sorttype=text";
      const { data } = await axios.get(
        process.env.NODE_ENV === "production"
          ? window.location.origin + "/" + url
          : "http://127.0.0.1/" + url
      );
      this.types = data;
      this.fetchMedias("[PROCCES/State!='DONE']");
    },
    async fetchMedias(toto) {
      this.loading = true;
      const [year, month, day] = this.selectedDate.split("-");
      let url =
        "ROOT/LOGGING/YEAR[YEAR='" +
        year +
        "']/MONTH[MONTH='" +
        month +
        "']/DAY[DAY='" +
        day +
        "']/EVENT";
      if (this.selectedTrack !== "All") {
        url += "[ID='" + this.selectedTrack + "']";
      }
      url +=
        "/TYPE/MEDIA" +
        toto +
        "@" +
        "ID|" +
        "NAME|" +
        "MEDIALOG/METADATA[1]/EVENTDATE|" +
        "MEDIALOG/METADATA[1]/TRACKNAME|" +
        "MEDIALOG/METADATA[1]/TYPE|" +
        "MEDIALOG/METADATA[1]/RACENR|" +
        "MEDIALOG/METADATA[1]/HORSENR|" +
        "MEDIALOG/METADATA/TAG|" +
        "MEDIALOG/METADATA/TEXT|" +
        "PROCCES/State|" +
        "PROCCES/URL|" +
        "MEDIALOG/DURATION|" +
        "PROCCES/TimeSpan/StartTime|" +
        "PROCCES/TimeSpan/EndTime|" +
        "PROCCES/TimeSpan/Duration" +
        "?version=v2&type=copy";
      const { data } = await axios.get(
        process.env.NODE_ENV === "production"
          ? window.location.origin + "/" + url
          : "http://127.0.0.1/" + url
      );
      this.medias = data.map((media) => ({
        ...media,
        DURATION: moment(media?.DURATION, "HH:mm:ss:SS").format("HH:mm:ss"),
        Duration: moment(media?.Duration, "HH:mm:ss:SSS").format("HH:mm:ss"),
        StartTime: moment(media?.StartTime, "YYYY-MM-DD HH:mm:ss,SSS").format(
          "YYYY-MM-DD HH:mm:ss"
        ),
        EndTime: moment(media?.EndTime, "YYYY-MM-DD HH:mm:ss,SSS").format(
          "YYYY-MM-DD HH:mm:ss"
        ),
        ClusterId: media?.URL?.match(/\/\/([^/]+)/)?.[1],
      }));
      this.loading = false;
      // this.maketypesMediasArray();
    },
    async getNodes(id: string, track: string, type: string) {
      const [year, month, day] = this.selectedDate.split("-");
      const url = `ROOT/LOGGING/YEAR[YEAR='${year}']/MONTH[MONTH='${month}']/DAY[DAY='${day}']/EVENT[ID='${track}']/TYPE[ID='${type}']/MEDIA[ID='${id}']/PROCCES/Nodes/item@Id|Name|State|TimeSpan/Duration|Delay/MilliSeconds?version=v2&type=copy`;
      const { data } = await axios.get(
        process.env.NODE_ENV === "production"
          ? window.location.origin + "/" + url
          : "http://127.0.0.1/" + url
      );
      this.nodes = data.map((node) => ({
        ...node,
        Duration: moment(node?.Duration, "HH:mm:ss:SSS").format("HH:mm:ss"),
      }));
    },
    async fetchMediaLog(
      date: string,
      trackName: string,
      type: string,
      id: string
    ) {
      const [year, month, day] = date.split("-");
      const url = `ROOT/LOGGING/YEAR[YEAR='${year}']/MONTH[MONTH='${month}']/DAY[DAY='${day}']/EVENT[ID='${trackName}']/TYPE[ID='${type}']/MEDIA[ID='${id}']/MEDIALOG?type=copy`;
      const { data } = await axios.get(
        process.env.NODE_ENV === "production"
          ? window.location.origin + "/" + url
          : "http://127.0.0.1/" + url
      );
      this.resendLog(data.MEDIALOG);
    },
    async resendLog(mediaLog) {
      try {
        await axios.post("http://10.200.2.93/logging/", mediaLog, {
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
          },
        });
        message
          .loading("Resending..", 1)
          .then(() => message.success("Resend confirmed", 2));
      } catch (error) {
        console.error(error);
        message
          .loading("Resending..", 1)
          .then(() => message.error("Resend unsuccesfull", 2));
      }
    },
    async deleteLog(date: string, trackName: string, type: string, id: string) {
      if (!date || !trackName || !type || !id) {
        message.error("Something went wrong, please try again", 3);
        return;
      }
      const [year, month, day] = date.split("-");
      const xml = `<DELETES>
          <DELETE>
            <XPATHS>
              <XPATH>ROOT/LOGGING/YEAR[YEAR="${year}"]/MONTH[MONTH="${month}"]/DAY[DAY="${day}"]/EVENT[ID="${trackName}"]/TYPE[ID="${type}"]/MEDIA[ID="${id}"]</XPATH>
            </XPATHS>
            <STORAGEIDS>
              <STORAGEID>LOGGING_${id}</STORAGEID>
            </STORAGEIDS>
          </DELETE>
        </DELETES>`;

      try {
        await axios.post(
          process.env.NODE_ENV === "production"
            ? window.location.origin + "/" + "delete/"
            : "http://127.0.0.1/" + "delete/",
          xml,
          {
            headers: {
              "Content-Type": "application/xml; charset=utf-8",
            },
          }
        );
        // Handle success
        message.success("Delete confirmed", 3);
        const index = this.medias.findIndex((media) => media.ID === id);
        if (index !== -1) {
          this.medias.splice(index, 1);
        }
      } catch (error) {
        // Handle error
        message
          .loading("Deleting..", 1)
          .then(() => message.error("Delete unsuccesfull", 3));
      }
    },
    async stopLog(url: string) {
      try {
        await axios.get(url + "/stop");
        message
          .loading("Stopping..", 1)
          .then(() => message.success("Stop confirmed", 2));
      } catch (error) {
        message
          .loading("Stopping..", 1)
          .then(() => message.error("Stop unsuccesfull", 2));
      }
    },
  },
});
