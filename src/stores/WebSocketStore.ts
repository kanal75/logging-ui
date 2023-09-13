import { defineStore } from "pinia";
import { useRootStore } from "./RootStore";
import moment from "moment";
export const useWebSocketStore = defineStore({
  id: "WebSocketStore",
  state: () => ({
    socket: null,
  }),
  actions: {
    async connectWebSocket() {
      const rootStore = useRootStore();
      this.socket = new WebSocket(
        "ws://" + window.location.hostname + "/vodreport"
      );
      this.socket.onopen = () => {
        console.log("WebSocket connection established");
      };
      this.socket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        if (!message.Id) {
          const media = message.LOGGING.YEAR.MONTH.DAY.EVENT.TYPE.MEDIA;
          const mediaData = {
            ID: media.ID,
            NAME: media.NAME,
            EVENTDATE: media.MEDIALOG?.METADATA.EVENTDATE,
            TRACKNAME: media.MEDIALOG?.METADATA.TRACKNAME,
            TYPE: media.MEDIALOG?.METADATA.TYPE,
            RACENR: media.MEDIALOG?.METADATA.RACENR,
            HORSENR: media.MEDIALOG?.METADATA.HORSENR,
            DURATION: moment(media.MEDIALOG?.DURATION, "HH:mm:ss:SS").format(
              "HH:mm:ss"
            ),
          };

          const existingMedia = rootStore.medias.find(
            (media) => media.ID === mediaData.ID
          );

          if (existingMedia) {
            // Update existing media
            existingMedia.State = media.PROCCES?.State;
            existingMedia.URL = media.PROCCES?.URL;
            existingMedia.ClusterId =
              media.PROCCES?.URL.match(/\/\/([^/]+)/)?.[1];
            (existingMedia.Duration = moment(
              media.PROCCES?.TimeSpan.Duration,
              "HH:mm:ss:SS"
            ).format("HH:mm:ss")),
              (existingMedia.StartTime = moment(
                media.PROCCES?.TimeSpan.StartTime,
                "YYYY-MM-DD HH:mm:ss,SSS"
              ).format("YYYY-MM-DD HH:mm:ss"));
            existingMedia.EndTime = moment(
              media.PROCCES?.TimeSpan.EndTime,
              "YYYY-MM-DD HH:mm:ss,SSS"
            ).format("YYYY-MM-DD HH:mm:ss");
            if (existingMedia.ID === rootStore?.selectedMedia.ID) {
              // Update the nodes array
              const nodes = media.PROCCES.Nodes.map((node) => ({
                Id: node.Id,
                Name: node.Name,
                State: node.State,
                Duration: node?.Duration,
              }));
              rootStore.nodes = nodes;
            }
          } else {
            // Add new media to array
            const newMedia = {
              ...mediaData,
            };
            if (
              media.MEDIALOG?.METADATA.EVENTDATE === rootStore.selectedDate &&
              (media.MEDIALOG?.METADATA.TRACKNAME === rootStore.selectedTrack ||
                rootStore.selectedTrack === "All")
            ) {
              rootStore.medias.push(newMedia);
            }
          }
        } else {
          console.log("Connection Id:", message.Id);
        }
      };

      this.socket.onclose = () => {
        console.log("WebSocket connection closed");
      };
      this.socket.onerror = (error) => {
        console.log("WebSocket error:", error);
      };
    },
  },
});
