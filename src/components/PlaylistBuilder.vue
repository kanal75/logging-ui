<template>
  <div class="playlistcontainer">
    <div
      class="color-overlay"
      ref="coloroverlay"
      :style="{
        backgroundColor: '#' + playlist.color + (isdarkmode ? 'cc' : '80'),
      }"
    >
      <a-row>
        <a-col :span="19">
          <a-page-header
            class="playlistheader"
            :title="playlist.name"
            :sub-title="playlist.description"
            @ready="onPageHeaderReady"
            ref="playlistheader"
          >
          </a-page-header>
        </a-col>
        <a-col :span="1">
          <a-popover v-model="controlsVisible" title="Controls" trigger="click">
            <template #content>
              <!-- :style="{ color: '#c9d1d9' }"  :style="{ color: '#c9d1d9' }" :style="{ backgroundColor: playlist.color }"-->
              <!--:style="{ backgroundColor: "#" + playlist.color + '40' }"-->
              <a-button type="primary" @click="playChannel">Play</a-button>
              <a-button type="primary" @click="stopChannel">Stop</a-button>
              <a-button type="primary" @click="clearChannel"
                >Clear Channel</a-button
              >
              <a-button type="primary" @click="createChannel"
                >Create Channel</a-button
              >
              <a-button type="primary" @click="updateChannel"
                >Uppdate Channel</a-button
              >
            </template>
            <a-button type="primary" @click="toggleControls"
              ><setting-outlined
            /></a-button>
          </a-popover>
        </a-col>
        <a-col :span="4">
          <a-select v-model:value="selectedTimingValue">
            <a-select-option
              v-for="option in timingoptions"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </a-select-option>
          </a-select>
        </a-col>
      </a-row>
    </div>
    <div></div>
    <div class="playlistcontent">
      <draggable
        v-model="events"
        :item-key="getID"
        @start="dragstart"
        @end="dragend"
        :group="{ name: getListName, put: true }"
        @add="addEvent"
      >
        <template #item="{ element }">
          <div :key="Math.floor(Math.random() * 10100)">
            <a-row class="clip-container">
              <a-col :span="19">{{ element.Name }}</a-col>
              <a-col :span="3">
                {{
                  element.Duration
                    ? convertMillisecondsToDuration(
                        timestampToMilliseconds(element.Duration),
                        `${
                          timestampToMilliseconds(element.Duration) > 3599999
                            ? "HHh "
                            : ""
                        } 
                  ${
                    timestampToMilliseconds(element.Duration) > 59999
                      ? "MMm "
                      : ""
                  } 
                  SSs`
                      )
                    : "00:00:00"
                }}
              </a-col>
              <a-col :span="2">
                <a-space>
                  <check-outlined v-if="element.State == 'DONE'" />
                  <loading-outlined v-if="element.State == 'IN_PROGRESS'" />
                  <unordered-list-outlined v-if="element.State == 'WAITING'" />
                  <delete-outlined @click="deleteEvent(element.Id)" />
                </a-space>
              </a-col>
            </a-row>
          </div>
        </template>
      </draggable>
    </div>
    <div class="playlistsummary">
      <a-row>
        <a-col :span="19">Total duration</a-col>
        <a-col :span="3">{{ totalDuration }}</a-col>
        <a-col :span="2">
          <a-space>
            <delete-outlined @click="clearChannel" />
          </a-space>
        </a-col>
      </a-row>
      <!-- <a-row>
      </a-row> -->
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, watch } from "vue";
import { Playlist } from "./PlaylistBuilderConainer.vue";
import { Ref, computed } from "@vue/reactivity";
import draggable from "vuedraggable";
import { useMediaStore } from "@/stores/index";
import { storeToRefs } from "pinia";
import axios from "axios";
import {
  DeleteOutlined,
  CheckOutlined,
  LoadingOutlined,
  UnorderedListOutlined,
  SettingOutlined,
} from "@ant-design/icons-vue";

//const API_URL = 'localhost' //or '10.200.35.106'
const API_URL = "10.200.35.106";

export interface SmallClipEventInterface {
  Resource: string;
  Id: string;
  Duration: string;
  Name: string;
  State: string;
  SubEventCount: number;
  StartTime: string;
}

export interface ClipEventInterface {
  Id: string;
  Description: string;
  Duration: { MilliSeconds: number; TimeCode: string };
  FixedDuration: { MilliSeconds: number; TimeCode: string };
  Enabled: boolean;
  MetaData?: any;
  Name: string;
  SubEvents: SubEventsInterface[];
  State: string;
  HasDurationGap: boolean;
  DurationList: {
    Fixed: {
      MilliSeconds: number;
      TimeCode: string;
    };
    Relative: {
      MilliSeconds: number;
      TimeCode: string;
    };
    Gap: {
      MilliSeconds: number;
      TimeCode: string;
    };
    ToStart: {
      MilliSeconds: number;
      TimeCode: string;
    };
    Elapsed: {
      MilliSeconds: number;
      TimeCode: string;
    };
    ToEnd: {
      MilliSeconds: number;
      TimeCode: string;
    };
  };
}

export interface SubEventsInterface {
  Id: string;
  Name: string;
  Description: string;
  Type: string;
  OffsetTime: OffsetTimeInterface[];
  WebRequest: any[];
}

export interface OffsetTimeInterface {
  Anchor: string;
  Milliseconds: number;
}

function convertMillisecondsToDuration(
  milliseconds: number,
  format: string
): string {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const frames = Math.floor((milliseconds % 1000) / (1000 / 25));

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  let formattedDuration = format;

  // formattedDuration = formattedDuration.replace('HH', padNumber(hours))
  // formattedDuration = formattedDuration.replace('MM', padNumber(minutes))
  // formattedDuration = formattedDuration.replace('SS', padNumber(seconds))
  // formattedDuration = formattedDuration.replace('FF', padNumber(frames))

  formattedDuration = formattedDuration.replace("HH", hours.toString());
  formattedDuration = formattedDuration.replace("MM", minutes.toString());
  formattedDuration = formattedDuration.replace("SS", seconds.toString());
  formattedDuration = formattedDuration.replace("FF", frames.toString());

  return formattedDuration;
}

function timestampToMilliseconds(timestamp: string): number {
  const [hours, minutes, seconds, frames] = timestamp.split(":").map(Number);
  const totalSeconds = hours * 3600 + minutes * 60 + seconds;
  const totalMilliseconds =
    totalSeconds * 1000 + Math.floor((frames * 1000) / 25);
  return totalMilliseconds;
}

function padNumber(num: number): string {
  return num.toString().padStart(2, "0");
}

export default defineComponent({
  name: "PlaylistBuilder",
  components: {
    draggable,
    CheckOutlined,
    LoadingOutlined,
    UnorderedListOutlined,
    DeleteOutlined,
    SettingOutlined,
  },
  props: {
    playlist: {
      type: Object as () => Playlist,
      required: true,
    },
    sizeDivider: {
      type: Number,
      default: 1,
    },
  },
  setup(props) {
    const store = useMediaStore();
    const { draggedMedia } = storeToRefs(store);

    const playlistheader = ref();
    const coloroverlay = ref();

    let isdarkmode = false;

    const controlsVisible = ref(false);

    const selectedTimingValue = ref(
      props.playlist.defaultTiming ? props.playlist.defaultTiming : 2
    );
    const timingoptions = [
      { value: 1, label: "1 sec" },
      { value: 2, label: "2 sec" },
      { value: 3, label: "3 sec" },
      { value: 4, label: "4 sec" },
    ];

    const events: Ref<SmallClipEventInterface[]> = ref([]);
    const styleObject = {
      backgroundColor: props.playlist.color,
    };
    /* Data */
    const data = ref<{
      enabled: boolean;
      dragging: boolean;
    }>({
      enabled: true,
      dragging: false,
    });
    const totalDuration = computed(() => {
      let totms = events.value.reduce((acc, event) => {
        return (
          acc + (event.Duration ? timestampToMilliseconds(event.Duration) : 0)
        );
      }, 0);
      return convertMillisecondsToDuration(
        totms,
        `${totms > 3599999 ? "HHh " : ""} 
                  ${totms > 59999 ? "MMm " : ""} 
                  SSs`
      );
      // return convertMillisecondsToDuration(2000, 'MM min SSs')
    });

    function onMove(e: any) {
      console.log(e);
    }

    function dragend(e: any) {
      data.value.dragging = false;
      // events.value.splice(e.newIndex, 0, events.value.splice(e.oldIndex, 1)[0])
      console.log(events);
      console.log(e);
    }

    function dragstart(e: any) {
      data.value.dragging = true;
      console.log(e);
    }

    interface Eventdata {
      name: string;
      id: string;
      duration: string;
      filename: string;
      filepath: string;
      location: string;
      racenr?: string;
      horsenr?: string;
      eventdate: string;
      trackname: string;
      trackid: string;
      type: string;
      playlistNumber: string;
      addGraphics: boolean;
    }
    function addEvent(to: any, from: any) {
      // get media data from draggedMedia.
      const media = draggedMedia.value;
      // get full Media info from server.
      let mediaInfo = {};
      if (media != null) {
        axios
          .get(
            `http://10.200.35.102/ROOT/LOGGING/YEAR[YEAR='${media.EVENTDATE.substring(
              0,
              4
            )}']/MONTH[MONTH='${media.EVENTDATE.substring(
              5,
              7
            )}']/DAY[DAY='${media.EVENTDATE.substring(
              8,
              10
            )}']/EVENT/TYPE/MEDIA[ID='${
              media.ID
            }']/METADATA?type=copy&version=v2`
          )
          .then(function (response) {
            if (response.data[0]) {
              mediaInfo = response.data;
              var eventdata: Eventdata = {
                name: media.NAME,
                id: media.ID,
                duration: media.DURATION,
                location: response.data[0].FILE.FULLNAME,
                filename: response.data[0].FILE.NAME,
                filepath: response.data[0].FILE.PATH,
                racenr: response.data[0].RACE,
                horsenr: response.data[0].HORSE ? response.data[0].HORSE : "1",
                eventdate: media.EVENTDATE,
                trackname: response.data[0].TRACK.NAME,
                trackid: response.data[0].TRACKID,
                type: media.TYPE,
                playlistNumber: props.playlist.id.substr(
                  props.playlist.id.length - 1
                ),
                addGraphics:
                  props.playlist.id.substr(props.playlist.id.length - 1) == "1"
                    ? true
                    : false,
              };
              sendNewEvent(eventdata, to.newIndex);
            } else {
              throw new Error("Media ID does not match Or is missing.");
            }
          })
          .catch(function (error) {
            // to.cancel()
            console.log(error);
          });
      }
      return false;
      // Run Media info through XSLT to get playlist compatible event data.
      // Add event to playlist.
    }

    function sendNewEvent(eventdata: Eventdata, newIndex: number) {
      console.log(
        `Attempting to add event to location ${newIndex} in playlist ${props.playlist.id}`
      );
      axios
        .post(`http://10.200.35.102/cliptoevent`, eventdata, {
          headers: { "Content-Type": "application/json; charset=utf-8" },
        })
        .then((response) => {
          if (events.value.length == 1) {
            events.value = [];
            axios
              .post(
                `http://${API_URL}/playout/channels/${props.playlist.id}/events`,
                response.data.clips[0],
                {
                  headers: {
                    "Content-Type": "application/json; charset=utf-8",
                  },
                }
              )
              .then(() => {
                updateChannel();
              });
          } else {
            if (newIndex == 0) {
              const precedingEvent = events.value[1];
              events.value.splice(newIndex, 1);
              axios
                .post(
                  `http://${API_URL}/playout/channels/${props.playlist.id}/events?addBefore=${precedingEvent.Id}`,
                  response.data.clips[0],
                  {
                    headers: {
                      "Content-Type": "application/json; charset=utf-8",
                    },
                  }
                )
                .then(() => {
                  updateChannel();
                });
            } else {
              const precedingEvent = events.value[newIndex - 1];
              events.value.splice(newIndex, 1);
              axios
                .post(
                  `http://${API_URL}/playout/channels/${props.playlist.id}/events?addAfter=${precedingEvent.Id}`,
                  response.data.clips[0],
                  {
                    headers: {
                      "Content-Type": "application/json; charset=utf-8",
                    },
                  }
                )
                .then(() => {
                  updateChannel();
                });
            }
          }

          // events.value.push(response.data)
        })
        .catch((error) => {
          console.log(error);
        });
    }

    function onPageHeaderReady() {
      // console.log('onPageHeaderReady')
      // playlistheader.value = document.querySelector('.ant-page-header-content')
      // coloroverlay.value = document.querySelector('.color-overlay')
      // console.log(`Attempting to apply: color-mix(in srgb, #161b22, ${props.playlist.color} 30%)`)
      // playlistheader.value.style.backgroundColor = `color-mix(in srgb, #161b22, ${props.playlist.color} 30%)`
    }

    onMounted(() => {
      console.log(coloroverlay.value);
      isdarkmode = checkifdarkmode();
      // coloroverlay.value.$el.style.backgroundColor = `${props.playlist.color}`
      // console.log(playlistheader.value.$el)
      // if (playlistheader.value.$el.closest('.page-style-dark')) {
      //   playlistheader.value.$el.style.backgroundColor = `color-mix(in srgb, #161b22, ${props.playlist.color} 30%)`
      // } else {
      //   playlistheader.value.$el.style.backgroundColor = `color-mix(in srgb, #ffffff, ${props.playlist.color} 30%)`
      // }
    });
    watch(selectedTimingValue, (newValue) => {
      clearInterval(updateintervall);
      updateintervall = setInterval(() => {
        updateChannel();
      }, newValue * 1000);
    });
    const config = {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
    };

    async function createChannel() {
      await axios.post(
        `http://${API_URL}/playout/channels`,
        {
          Id: props.playlist.id,
          Name: props.playlist.name,
          Description: props.playlist.description,
          MetaData: {
            theme: props.playlist.color,
          },
        },
        config
      );
    }

    async function updateChannel(prepfirst = false) {
      await axios
        .get(`http://${API_URL}/playout/channels/${props.playlist.id}`)
        .then((response) => {
          //get Events
          axios
            .get(
              `http://${API_URL}/playout/channels/${props.playlist.id}/events?size=small`
            )
            .then((response) => {
              events.value = response.data;
              if (prepfirst) {
                prepFrist();
              }
            });
        });
    }

    async function clearChannel() {
      for (const event of events.value) {
        await axios.delete(
          `http://${API_URL}/playout/channels/${props.playlist.id}/events/${event.Id}`
        );
      }
      updateChannel();
    }

    async function deleteEvent(id: string) {
      await axios
        .delete(
          `http://${API_URL}/playout/channels/${props.playlist.id}/events/${id}`
        )
        .then(() => {
          updateChannel();
        });
    }

    async function playChannel() {
      await axios.get(
        `http://${API_URL}/playout/channels/${props.playlist.id}/play`
      );
    }

    async function stopChannel() {
      await axios.get(
        `http://${API_URL}/playout/channels/${props.playlist.id}/stop`
      );
    }

    async function prepFrist() {
      await axios
        .get(`http://${API_URL}/${events.value[0].Resource}/subevents/3/send`)
        .then((response) => {
          //todo: fix this
          console.log(response);
        });
    }

    function checkifdarkmode() {
      if (playlistheader.value.$el.closest(".page-style-dark")) {
        return true;
      } else {
        return false;
      }
    }

    let updateintervall = setInterval(
      () => {
        updateChannel();
      },
      props.playlist.defaultTiming ? props.playlist.defaultTiming * 1000 : 2000
    );

    setInterval(() => {
      isdarkmode = checkifdarkmode();
    }, 1000);

    updateChannel();
    return {
      selectedTimingValue,
      timingoptions,
      isdarkmode,
      playChannel,
      stopChannel,
      clearChannel,
      updateChannel,
      createChannel,
      deleteEvent,
      events,
      totalDuration,
      convertMillisecondsToDuration,
      timestampToMilliseconds,
      styleObject,
      drag: false,
      clone: (e: ClipEventInterface): ClipEventInterface => {
        const cloned: ClipEventInterface = Object.assign({}, e);

        cloned.Id = Math.floor(Math.random() * 1000000).toString();
        return cloned;
      },
      data,
      onMove,
      dragend,
      dragstart,
      getID: (e: ClipEventInterface) => {
        return props.playlist.name + e.Id;
      },
      getListName: () => {
        return props.playlist.name;
      },
      addEvent,
      playlistheader,
      onPageHeaderReady,
      controlsVisible,
      toggleControls: () => {
        controlsVisible.value = !controlsVisible.value;
      },
    };
  },
});
</script>

<style lang="scss">
.flex-row {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}
.DONE {
  background-color: #28a745;
}
.WAITING {
  background-color: #ffc107;
}
.IN_PROGRESS {
  background-color: #17a2b8;
}
.page-style-dark {
  .playlistheader {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 10px;
    border-color: #282e35;
    background-color: transparent;
    color: #c9d1d9;
  }

  .playlistsummary {
    justify-content: space-between;
    padding: 10px;
    border-color: #282e35;
    background-color: #161b22;
    color: #c9d1d9;
    text-align: left;
    padding: 5px 15px;
  }

  .playlistsummary > div {
    padding: 0px 15px;
  }

  .playlistcontainer {
    border: 2px solid #282e35;
    border-radius: 2px;
  }

  .playlistcontent {
    background-color: #010409;
    padding: 15px;
  }

  .clip-container {
    background-color: #161b22;
    margin: 2px 0;
    border-radius: 2px;
    border: 1px solid #282e35;
    text-align: left;
    padding: 5px 15px;
  }
  .ant-popover-content {
    background-color: #161b22;
    color: #c9d1d9;
  }
  .ant-popover-inner {
    background-color: #161b22;
    color: #c9d1d9;
  }

  .ant-popover-arrow-content {
    background-color: #161b22;
    color: #c9d1d9;
  }
}
.playlistheader {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 10px;
  border-color: #b4b4b4;
  background-color: transparent;
}

.playlistsummary {
  justify-content: space-between;
  padding: 10px;
  border-color: #b4b4b4;
  background-color: #ecf1f8;
  text-align: left;
  padding: 5px 15px;
}

.playlistsummary > div {
  padding: 0px 15px;
}

.playlistcontainer {
  margin: 15px;
  border: 2px solid #b4b4b4;
  border-radius: 2px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.playlistcontent {
  background-color: #ecf1f8;
  padding: 15px;
  flex: 1;
  display: flex;
  position: relative;
}

.playlistcontent > div {
  left: 15px;
  right: 15px;
  top: 15px;
  bottom: 15px;
  position: absolute;
  overflow: auto;
}

.clip-container {
  background-color: #ecf1f8;
  margin: 2px 0;
  border-radius: 2px;
  border: 1px solid #b4b4b4;
  text-align: left;
  padding: 5px 15px;
}
</style>
