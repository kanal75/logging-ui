<template>
  <div>
    <template v-if="rootStore.loading">
      <a-skeleton :active="true" />
    </template>
    <template v-else>
      <div class="table-operations"></div>
      <a-card
        style="width: 100%"
        :bordered="false"
        :tab-list="trackTabs"
        :active-tab-key="rootStore.selectedTrack"
        @tabChange="onTabChange"
      >
        <template #title>
          <a-typography-title :level="2" orientation="left"
            >{{ rootStore.selectedDate }} -
            {{ rootStore.selectedTrack }}</a-typography-title
          >
        </template>
        <template #extra>
          <a-space style="font-size: 30px">
            <a-popover>
              <template #content>
                <a-typography-title :level="5"> Show All </a-typography-title>
              </template>
              <a> <eye-outlined @click="rootStore.fetchMedias('')" /> </a>
            </a-popover>
            <a-divider type="vertical" />
            <a-popover>
              <template #content>
                <a-typography-title :level="5"> Live List </a-typography-title>
              </template>
              <a>
                <unordered-list-outlined
                  @click="refDataStore.errorListVisible = true"
                />
              </a>
            </a-popover>
            <a-divider type="vertical" />
            <a-popconfirm
              title="Clear all filters & sorters?"
              ok-text="Yes"
              cancel-text="No"
              @confirm="clearFilters"
            >
              <a-popover>
                <template #content>
                  <a-typography-title :level="5">
                    Clear Filter & Sorters
                  </a-typography-title>
                </template>
                <a>
                  <clear-outlined />
                </a>
              </a-popover>
            </a-popconfirm>
            <a-divider type="vertical" />
            <a-popover trigger="hover">
              <template #content>
                <a-typography-title :level="5"> Columns </a-typography-title>
              </template>

              <a-popover title="Chose Columns" trigger="click">
                <template #content>
                  <ul>
                    <li v-for="column in columns" :key="column.key">
                      <input
                        type="checkbox"
                        v-model="columnsVisibility[column.key]"
                      />
                      {{ column.title }}
                    </li>
                  </ul>
                </template>
                <a>
                  <delete-column-outlined />
                </a>
              </a-popover>
            </a-popover>
            <a-divider type="vertical" />
            <a-popover trigger="hover">
              <template #content>
                <a-typography-title :level="5"> Calendar </a-typography-title>
              </template>

              <a-popover title="Chose Date" trigger="click">
                <template #content>
                  <a-date-picker
                    format="YYYY-MM-DD"
                    value-format="YYYY-MM-DD"
                    v-model:value="rootStore.selectedDate"
                    :disabled-date="disabledDate"
                    @change="
                      rootStore.fetchTracks() ? rootStore.selectedDate : ''
                    "
                  />
                </template>
                <a>
                  <calendar-outlined />
                </a>
              </a-popover>
            </a-popover>
          </a-space>
        </template>
        <a-table
          class="ant-table-striped"
          :dataSource="rootStore.medias"
          :columns="filteredColumns"
          :pagination="false"
          size="small"
          @change="handleChange"
          :row-class-name="
            (_record, index) => (index % 2 === 1 ? 'table-striped' : null)
          "
        >
          <template v-slot:bodyCell="{ column, record }">
            <template v-if="column.key === 'trackName' && record.TRACKNAME">
              <span class="track">{{ record.TRACKNAME }}</span>
            </template>
            <template v-if="column.key === 'id' && record.ID">
              <span>{{ record.ID }}</span>
            </template>
            <template v-if="column.key === 'name' && record.NAME">
              <span>{{ record.NAME }}</span>
            </template>
            <template v-if="column.key === 'type' && record.TYPE">
              <span class="type">{{ record.TYPE }}</span>
            </template>
            <template v-if="column.key === 'raceNr' && record.RACENR">
              <div :class="'r' + record.RACENR">{{ record.RACENR }}</div>
            </template>
            <template v-if="column.key === 'hNr' && record.HORSENR">
              <span>{{ record.HORSENR }}</span>
            </template>
            <template v-if="column.key === 'tags' && record.TAG">
              <div v-if="Array.isArray(record.TAG)">
                <span
                  v-for="(tag, index) in record.TAG"
                  :key="index"
                  class="tag"
                >
                  {{ tag }}
                </span>
              </div>
              <div v-else>
                <span class="tag">
                  {{ record.TAG }}
                </span>
              </div>
            </template>
            <template v-if="column.key === 'text' && record.TEXT">
              <span>{{ record.TEXT }}</span>
            </template>
            <template v-if="column.key === 'clipDuration' && record.DURATION">
              <span>{{ record.DURATION }}</span>
            </template>
            <template v-if="column.key === 'startTime' && record.StartTime">
              <span>{{ record.StartTime }}</span>
            </template>
            <template v-if="column.key === 'endTime' && record.EndTime">
              <span>{{ record.EndTime }}</span>
            </template>
            <template
              v-if="column.key === 'processDuration' && record.Duration"
            >
              <span>{{ record.Duration }}</span>
            </template>
            <template v-if="column.key === 'status'">
              <check-circle-outlined
                v-if="record.State === 'DONE'"
                :style="{ color: 'green' }"
              />
              <loading-outlined
                v-if="record.State === 'IN_PROGRESS'"
                :style="{ color: 'blue' }"
              />
              <close-circle-outlined
                v-if="
                  record.State === 'DONE_WITH_ERROR' ||
                  record.State === 'IN_PROGRESS_WITH_ERROR'
                "
                :style="{ color: 'red' }"
              />
              <stop-outlined v-if="record.State === 'STOPPED'" />
              <pause-circle-outlined v-if="record.State === 'WAITING'" />
              <clock-circle-outlined
                v-if="record.State === 'IN_PROGRESS_WITH_DELAY'"
                :style="{ color: 'blue' }"
              />
            </template>
            <template v-if="column.key === 'clusterId' && record.ClusterId">
              <span>{{ record.ClusterId }}</span>
            </template>
            <template v-if="column.key === 'url' && record.URL">
              <span>{{ record.URL }}</span>
            </template>
            <template v-if="column.key === 'actions'">
              <logActions :item="record" />
            </template>
            <template v-if="column.key === 'dragAction'">
              <dragAction :item="record" />
            </template>
          </template>
        </a-table>
        <errorList />
        <stepsDrawer />
      </a-card>
    </template>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, Ref, ComputedRef, computed } from "vue";
import { useRootStore } from "@/stores/RootStore";
import { useRefDataStore } from "@/stores/RefDataStore";
import moment from "moment";
import errorList from "@/components/errorList.vue";
import stepsDrawer from "@/components/stepsDrawer.vue";
import logActions from "@/components/logActions.vue";
import dragAction from "@/components/dragAction.vue";
//import draggable from "vuedraggable";
import type { TableColumnType, TableProps } from "ant-design-vue";
import {
  LoadingOutlined,
  StopOutlined,
  CheckCircleOutlined,
  PauseCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  DeleteColumnOutlined,
  UnorderedListOutlined,
  ClearOutlined,
  CalendarOutlined,
  EyeOutlined,
} from "@ant-design/icons-vue";
export default defineComponent({
  components: {
    //draggable,
    errorList,
    stepsDrawer,
    logActions,
    dragAction,
    LoadingOutlined,
    StopOutlined,
    CheckCircleOutlined,
    PauseCircleOutlined,
    ClockCircleOutlined,
    CloseCircleOutlined,
    DeleteColumnOutlined,
    UnorderedListOutlined,
    ClearOutlined,
    CalendarOutlined,
    EyeOutlined,
  },
  setup() {
    const rootStore = useRootStore();
    rootStore.fetchDays();
    const refDataStore = useRefDataStore();
    const filteredInfo = ref();
    const sortedInfo = ref();
    const columns = computed<TableColumnType[]>(() => {
      const filtered = filteredInfo.value || {};
      const sorted = sortedInfo.value || {};
      return [
        {
          title: "Track Name",
          dataIndex: "trackName",
          key: "trackName",
          filters: filtersByField("TRACKNAME"),
          onFilter: onFilter("TRACKNAME"),
          filteredValue: filtered.trackName || null,
          sorter: stringSorter("TRACKNAME"),
          sortOrder: sorted.columnKey === "trackName" && sorted.order,
        },
        {
          title: "ID",
          dataIndex: "id",
          key: "id",
          sorter: stringSorter("ID"),
          sortOrder: sorted.columnKey === "id" && sorted.order,
        },
        {
          title: "Name",
          dataIndex: "name",
          key: "name",
          sorter: stringSorter("NAME"),
          sortOrder: sorted.columnKey === "name" && sorted.order,
        },
        {
          title: "Type",
          dataIndex: "type",
          key: "type",
          filters: filtersByField("TYPE"),
          onFilter: onFilter("TYPE"),
          filteredValue: filtered.type || null,
          sorter: stringSorter("TYPE"),
          sortOrder: sorted.columnKey === "type" && sorted.order,
        },
        {
          title: "Race",
          dataIndex: "raceNr",
          key: "raceNr",
          filters: filtersByField("RACENR"),
          onFilter: onFilter("RACENR"),
          filteredValue: filtered.raceNr || null,
          sorter: (a, b) => (a.RACENR || "") - (b.RACENR || ""),
          sortOrder: sorted.columnKey === "raceNr" && sorted.order,
        },
        {
          title: "Horse",
          dataIndex: "hNr",
          key: "hNr",
          sortDirections: ["descend", "ascend"],
          filters: filtersByField("HORSENR"),
          onFilter: onFilter("HORSENR"),
          filteredValue: filtered.hNr || null,
          sorter: (a, b) => (a.HORSENR || "") - (b.HORSENR || ""),
          sortOrder: sorted.columnKey === "hNr" && sorted.order,
        },
        {
          title: "Tags",
          key: "tags",
          dataIndex: "tags",
          filters: [
            { text: "Has Tag", value: "hasTag" },
            { text: "No Tag", value: "noTag" },
          ],
          filterMultiple: false,
          onFilter: (value, record) => {
            if (value === "hasTag") {
              return record.TAG !== undefined;
            } else if (value === "noTag") {
              return record.TAG === undefined;
            } else {
              return true;
            }
          },
          filteredValue: filtered.tags || null,
          sorter: stringSorter("TAG"),
          sortOrder: sorted.columnKey === "tags" && sorted.order,
        },
        {
          title: "Text",
          key: "text",
          dataIndex: "text",
          filters: [
            { text: "Has Text", value: "hasText" },
            { text: "No Text", value: "noText" },
          ],
          filterMultiple: false,
          onFilter: (value, record) => {
            if (value === "hasText") {
              return record.TEXT !== undefined;
            } else if (value === "noText") {
              return record.TEXT === undefined;
            } else {
              return true;
            }
          },
          filteredValue: filtered.text || null,
          sorter: stringSorter("TEXT"),
          sortOrder: sorted.columnKey === "text" && sorted.order,
        },
        {
          title: "Start Time",
          key: "startTime",
          dataIndex: "startTime",
          sorter: (a, b) => {
            const startTimeA = moment(a.StartTime);
            const startTimeB = moment(b.StartTime);
            return startTimeA.unix() - startTimeB.unix();
          },
          sortOrder: sorted.columnKey === "startTime" && sorted.order,
        },
        {
          title: "End Time",
          key: "endTime",
          dataIndex: "endTime",
          sorter: (a, b) => {
            const endTimeA = moment(a.EndTime);
            const endTimeB = moment(b.EndTime);
            return endTimeA.unix() - endTimeB.unix();
          },
          sortOrder: sorted.columnKey === "endTime" && sorted.order,
        },
        {
          title: "Process durattion",
          key: "processDuration",
          dataIndex: "processDuration",

          sorter: (a, b) => {
            const durationA = moment.duration(a.Duration).asSeconds();
            const durationB = moment.duration(b.Duration).asSeconds();
            return durationA - durationB;
          },
          sortOrder: sorted.columnKey === "processDuration" && sorted.order,
        },
        {
          title: "Clip Durattion",
          key: "clipDuration",
          dataIndex: "clipDuration",
          sorter: (a, b) => {
            const durationA = moment.duration(a.DURATION).asSeconds();
            const durationB = moment.duration(b.DURATION).asSeconds();
            return durationA - durationB;
          },
          sortOrder: sorted.columnKey === "clipDuration" && sorted.order,
        },
        {
          title: "Status",
          key: "status",
          dataIndex: "status",
          filters: [
            { text: "Done", value: "DONE" },
            { text: "Failed", value: "DONE_WITH_ERROR" },
            { text: "In Progress", value: "IN_PROGRESS" },
            { text: "In Progress With Error", value: "IN_PROGRESS_WITH_ERROR" },
            { text: "Delayed", value: "IN_PROGRESS_WITH_DELAY" },
            { text: "Waiting", value: "WAITING" },
            { text: "Stopped", value: "STOPPED" },
          ],
          onFilter: onFilter("State"),
          filteredValue: filtered.status || null,
          sorter: stringSorter("State"),
          sortOrder: sorted.columnKey === "status" && sorted.order,
        },
        {
          title: "URL",
          key: "url",
          dataIndex: "url",
          sorter: (a, b) => {
            const regex =
              /http:\/\/10\.200\.2\.(\d+)\/processengine\/processes\/(\d+)/;
            const [, numA1, numA2] = a.URL.match(regex);
            const [, numB1, numB2] = b.URL.match(regex);

            // Compare the numerical parts of the URLs
            if (numA1 !== numB1) {
              return Number(numA1) - Number(numB1);
            }
            return Number(numA2) - Number(numB2);
          },
          sortOrder: sorted.columnKey === "url" && sorted.order,
        },
        {
          title: "Cluster",
          key: "clusterId",
          dataIndex: "clusterId",
          filters: filtersByField("ClusterId"),
          onFilter: onFilter("ClusterId"),
          filteredValue: filtered.clusterId || null,
          sorter: (a, b) => {
            const clusterA = a.ClusterId.split(".").map(Number);
            const clusterB = b.ClusterId.split(".").map(Number);

            // Compare the numerical parts of the cluster values
            for (let i = 0; i < clusterA.length; i++) {
              if (clusterA[i] !== clusterB[i]) {
                return clusterA[i] - clusterB[i];
              }
            }

            // If all numerical parts are the same, the clusters are equal
            return 0;
          },
          sortOrder: sorted.columnKey === "clusterId" && sorted.order,
        },
        {
          title: "Actions",
          key: "actions",
          dataIndex: "actions",
        },
        {
          title: "Drag",
          key: "dragAction",
          dataIndex: "dragAction",
        },
      ];
    });
    const columnsVisibility = ref({
      trackName: ref(true),
      id: false,
      name: false,
      type: true,
      raceNr: true,
      hNr: true,
      tags: true,
      text: false,
      startTime: true,
      endTime: false,
      processDuration: false,
      clipDuration: true,
      status: true,
      url: false,
      clusterId: false,
      actions: false,
      dragAction: true,
      // Add other column keys and set their initial visibility
    });
    const filteredColumns = computed(() => {
      return columns.value.filter(
        (column) => columnsVisibility.value[column.key]
      );
    });
    interface Record {
      State: string;
      [key: string]: string | number | boolean | undefined | null;
    }
    const stringSorter = (field: string) => (a: string, b: string) => {
      const stringA = (a[field] || "").toLowerCase();
      const stringB = (b[field] || "").toLowerCase();
      return stringA.localeCompare(stringB);
    };

    interface Option {
      text: string;
      value: string | number | boolean;
    }

    const filtersByField = (field: string): Option[] => {
      const rootStore = useRootStore();
      const values: (string | number | boolean)[] = rootStore.medias
        .map((record: Record) => record[field])
        .filter(
          (value: string | number | boolean | undefined | null) =>
            value != null && value.toString().trim() !== ""
        );

      const uniqueValues = [...new Set(values)].sort(
        (a: string | number | boolean, b: string | number | boolean) => {
          if (typeof a !== "number" || typeof b !== "number") {
            // If one or both values are not numbers, compare as strings
            return String(a).localeCompare(String(b));
          }
          // If both values are numbers, compare numerically
          return a - b;
        }
      );

      let options: Option[] = uniqueValues.map(
        (value: string | number | boolean) => ({
          text: String(value),
          value: value,
        })
      );
      if (rootStore.medias.some((record: Record) => !record[field])) {
        options = [{ text: `No ${field}`, value: "" }, ...options];
      }

      return options;
    };
    type FilterFunction = (
      value: string,
      record: Record
    ) => boolean | undefined;
    const onFilter =
      (field: string): FilterFunction =>
      (value: string, record: Record): boolean | undefined => {
        if (value === "") {
          return !record[field];
        } else if (record[field]) {
          //const regex = new RegExp(`^${value}(\\D|$)`);
          //return record[field].match(regex) !== null;
          return record[field] === value;
        }
      };
    type TagColor = "success" | "error" | "processing" | "waiting" | "default";
    const tagColor = (record: Record): TagColor => {
      return record.State === "DONE"
        ? "success"
        : record.State === "DONE_WITH_ERROR" ||
          record.State === "IN_PROGRESS_WITH_ERROR"
        ? "error"
        : record.State === "IN_PROGRESS"
        ? "processing"
        : record.State === "IN_PROGRESS_WITH_DELAY"
        ? "processing"
        : record.State === "WAITING"
        ? "waiting"
        : "default";
    };
    // Create a computed property that returns an array of track objects
    interface Track {
      key: string;
      tab: string;
    }
    const tracks: ComputedRef<Track[]> = computed(() => {
      return rootStore.tracks.map((track: { ID: string }) => ({
        key: track.ID,
        tab: track.ID,
      }));
    });

    // Generate the tab list object from the computed tracks property
    const trackTabs = computed(() => tracks.value);

    // Handle tab changes
    const activeTabKey: Ref<string> = ref(rootStore.selectedTrack);
    const onTabChange = (key: string): void => {
      rootStore.selectedTrack = key;
      activeTabKey.value = key;
      rootStore.fetchTypes();
    };
    const value = ref();

    const disabledDate = (current: moment.Moment): boolean => {
      const enabledDays: string[] = rootStore.$state.days;
      const currentDate: string = current.format("YYYY-MM-DD");
      return !enabledDays.includes(currentDate);
    };
    const handleChange: TableProps["onChange"] = (
      pagination,
      filters,
      sorter
    ) => {
      console.log("Various parameters", pagination, filters, sorter);
      filteredInfo.value = filters;
      sortedInfo.value = sorter;
    };
    const clearFilters = (): void => {
      filteredInfo.value = null;
      sortedInfo.value = null;
    };
    return {
      rootStore,
      refDataStore,
      filteredColumns,
      tagColor,
      filtersByField,
      onFilter,
      activeTabKey,
      trackTabs,
      onTabChange,
      value,
      disabledDate,
      handleChange,
      clearFilters,
      columnsVisibility,
      columns,
    };
  },
});
</script>
<style lang="css" scoped>
.ant-table-striped :deep(.table-striped) td {
  background-color: #f0f0f0;
}
.track {
  font-family: atgrubrikbeta, Arial, sans-serif;
  font-size: 12px;
  float: left;
  padding: 4px 9px;
  color: rgb(0, 0, 0);
  background-image: linear-gradient(rgb(254, 229, 103) 0px, rgb(254, 212, 1));
  box-shadow: rgb(34, 34, 34) 1px 1px 2px;
  border-radius: 2%;
  font-weight: bold;
}
.type {
  white-space: nowrap;
  font-family: atgrubrikbeta, "Arial", sans-serif;
  font-size: 12px;
  float: left;
  padding: 4px 9px;
  background-color: #ffffff;
  background-image: linear-gradient(180deg, #ffffff 0, #f2f2f2);
  box-shadow: 1px 1px 2px #222;
  color: #000;
  text-align: left;
  border-radius: 2%;
  font-weight: bold;
}
.tag {
  white-space: nowrap;
  font-family: atgrubrikbeta, "Arial", sans-serif;
  font-size: 12px;
  padding: 5px 10px;
  margin-right: 5px;
  background-image: linear-gradient(180deg, #444 0, #333);
  box-shadow: 1px 1px 2px #222;
  color: #fff;
  border-radius: 3%;
  text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.3);
}
.r1,
.r1c,
.r1c:before {
  color: #000;
  background: #fff22a;
  background-image: linear-gradient(180deg, #fff22a 0, #ffee00);
}

.r1 {
  font-family: atgrubrikbeta, "Arial", sans-serif;
  padding: 5px 1px;
  width: 35px;
  box-shadow: 1px 1px 2px #222;
  text-align: center;
  border-radius: 5%;
  font-weight: bold;
}

.r2,
.r2c,
.r2c:before {
  color: #fff;
  background-color: #009ada;
  background-image: linear-gradient(180deg, #009ada 0, #006b99);
}

.r2 {
  font-family: atgrubrikbeta, "Arial", sans-serif;
  padding: 5px 1px;
  width: 35px;
  box-shadow: 1px 1px 2px #222;
  text-align: center;
  border-radius: 5%;
  font-weight: bold;
}
.r3 {
  font-family: atgrubrikbeta, "Arial", sans-serif;
  padding: 5px 1px;
  width: 35px;
  box-shadow: 1px 1px 2px #222;
  text-shadow: 1px 1px 2px #000;
  text-align: center;
  border-radius: 5%;
  font-weight: bold;
}

.r3,
.r3c,
.r3c:before {
  color: #fff;
  background: #f14643;
  background-image: linear-gradient(180deg, #f14643 0, #be110e);
}

.r4 {
  font-family: atgrubrikbeta, "Arial", sans-serif;
  padding: 5px 1px;
  width: 35px;
  box-shadow: 1px 1px 2px #222;
  text-shadow: 1px 1px 2px #000;
  text-align: center;
  border-radius: 5%;
  font-weight: bold;
}

.r4,
.r4c,
.r4c:before {
  color: #fff;
  background: #00a851;
  background-image: linear-gradient(180deg, #00a851 0, #006631);
}

.r5 {
  font-family: atgrubrikbeta, "Arial", sans-serif;
  padding: 5px 1px;
  width: 35px;
  color: #000;
  background: #fff;
  background-image: linear-gradient(180deg, #fff 0, #f2f2f2);
  box-shadow: 1px 1px 2px #222;

  text-align: center;
  border-radius: 5%;
  font-weight: bold;
}

.r5,
.r5c,
.r5c:before {
  color: #000;
  background: #fff;
  background-image: linear-gradient(180deg, #fff 0, #f2f2f2);
}

.r6 {
  font-family: atgrubrikbeta, "Arial", sans-serif;
  padding: 5px 1px;
  width: 35px;
  color: #fff;
  background: #000;
  box-shadow: 1px 1px 2px #222;
  text-shadow: 1px 1px 2px #000;
  text-align: center;
  border-radius: 5%;
  font-weight: bold;
}

.r6,
.r6c,
.r6c:before {
  color: #fff;
  background: #000;
}

.r7 {
  font-family: atgrubrikbeta, "Arial", sans-serif;
  padding: 5px 1px;
  width: 35px;
  color: #000;
  background: #c8a875;
  background-image: linear-gradient(180deg, #c8a875 0, #b68c49);
  box-shadow: 1px 1px 2px #222;
  text-align: center;
  border-radius: 5%;
  font-weight: bold;
}

.r7,
.r7c,
.r7c:before {
  color: #000;
  background: #c8a875;
  background-image: linear-gradient(180deg, #c8a875 0, #b68c49);
}

.r8 {
  font-family: atgrubrikbeta, "Arial", sans-serif;
  padding: 5px 1px;
  width: 35px;
  color: #fff;
  background: #8c54a2;
  background-image: linear-gradient(180deg, #8c54a2 0, #663d76);
  box-shadow: 1px 1px 2px #222;
  text-shadow: 1px 1px 2px #000;
  text-align: center;
  border-radius: 5%;
  font-weight: bold;
}

.r8,
.r8c,
.r8c:before {
  color: #fff;
  background: #8c54a2;
  background-image: linear-gradient(180deg, #8c54a2 0, #663d76);
}

.r9 {
  font-family: atgrubrikbeta, "Arial", sans-serif;
  padding: 5px 1px;
  width: 35px;
  color: #000;
  background: #91c849;
  background-image: linear-gradient(180deg, #91c849 0, #6d9d2f);
  box-shadow: 1px 1px 2px #222;
  text-align: center;
  border-radius: 5%;
  font-weight: bold;
}

.r9,
.r9c,
.r9c:before {
  color: #000;
  background: #91c849;
  background-image: linear-gradient(180deg, #91c849 0, #6d9d2f);
}

.r10 {
  font-family: atgrubrikbeta, "Arial", sans-serif;
  padding: 5px 1px;
  width: 35px;
  color: #000;
  background: #ee81b3;
  background-image: linear-gradient(180deg, #ee81b3 0, #ea62a1);
  box-shadow: 1px 1px 2px #222;
  text-align: center;
  border-radius: 5%;
  font-weight: bold;
}

.r10,
.r10c,
.r10c:before {
  color: #000;
  background: #ee81b3;
  background-image: linear-gradient(180deg, #ee81b3 0, #ea62a1);
}

.r11 {
  font-family: atgrubrikbeta, "Arial", sans-serif;
  padding: 5px 1px;
  width: 35px;
  color: #000;
  background: #f89d53;
  background-image: linear-gradient(180deg, #f89d53 0, #f68223);
  box-shadow: 1px 1px 2px #222;
  text-align: center;
  border-radius: 5%;
  font-weight: bold;
}

.r11,
.r11c,
.r11c:before {
  color: #000;
  background: #f89d53;
  background-image: linear-gradient(180deg, #f89d53 0, #f68223);
}

.r12 {
  font-family: atgrubrikbeta, "Arial", sans-serif;
  padding: 5px 1px;
  width: 35px;
  color: #fff;
  background: #8b3f0f;
  background-image: linear-gradient(180deg, #8b3f0f 0, #5c290a);
  box-shadow: 1px 1px 2px #222;
  text-shadow: 1px 1px 2px #000;
  text-align: center;
  border-radius: 5%;
  font-weight: bold;
}

.r12,
.r12c,
.r12c:before {
  color: #fff;
  background: #8b3f0f;
  background-image: linear-gradient(180deg, #8b3f0f 0, #5c290a);
}

.r13 {
  font-family: atgrubrikbeta, "Arial", sans-serif;
  padding: 5px 1px;
  width: 35px;
  color: #000;
  background: #85c1eb;
  background-image: linear-gradient(180deg, #85c1eb 0, #65b0e6);
  box-shadow: 1px 1px 2px #222;
  text-align: center;
  border-radius: 5%;
  font-weight: bold;
}

.r13,
.r13c,
.r13c:before {
  color: #000;
  background: #85c1eb;
  background-image: linear-gradient(180deg, #85c1eb 0, #65b0e6);
}

.r14 {
  font-family: atgrubrikbeta, "Arial", sans-serif;
  padding: 5px 1px;
  width: 35px;
  color: #000;
  background: #fff;
  background-image: linear-gradient(180deg, #fff 0, #f2f2f2);
  box-shadow: 1px 1px 2px #222;
  text-align: center;
  border-radius: 5%;
  font-weight: bold;
}

.r14,
.r14c,
.r14c:before {
  color: #000;
  background: #fff;
  background-image: linear-gradient(180deg, #fff 0, #f2f2f2);
}

.r15,
.r16,
.r17,
.r18 {
  font-family: atgrubrikbeta, "Arial", sans-serif;
  padding: 5px 1px;
  width: 35px;
  color: #000;
  background: #fff;
  background-image: linear-gradient(180deg, #fff 0, #f2f2f2);
  box-shadow: 1px 1px 2px #222;
  text-align: center;
  border-radius: 5%;
  font-weight: bold;
}

.r15,
.r15c,
.r15c:before,
.r16,
.r16c,
.r16c:before,
.r17,
.r17c,
.r17c:before,
.r18,
.r18c,
.r18c:before {
  color: #000;
  background: #fff;
  background-image: linear-gradient(180deg, #fff 0, #f2f2f2);
}
</style>
