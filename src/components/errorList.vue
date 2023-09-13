<template>
  <a-drawer
    v-model:visible="refDataStore.errorListVisible"
    class="custom-class"
    style="color: red"
    placement="right"
    :closable="false"
    :width="850"
  >
    <a-list item-layout="horizontal" :data-source="rootStore.medias">
      <template #header>
        <div>
          <a-typography-title :level="4" orientation="left"
            >Not Done List - {{ rootStore.selectedDate }} -
            {{ rootStore.selectedTrack }}</a-typography-title
          >
        </div>
      </template>
      <template #footer> </template>
      <template #renderItem="{ item }">
        <a-list-item v-if="item.State !== 'DONE'">
          <template #actions>
            <log-actions :item="item" />
          </template>
          <a-list-item-meta>
            <template #title>
              <a-typography-text :type="tagColor(item)">{{
                " " + item.TYPE
              }}</a-typography-text>
              <a-typography-text :type="tagColor(item)" v-if="item.RACENR">{{
                " " + item.RACENR
              }}</a-typography-text>
              <a-typography-text :type="tagColor(item)" v-if="item.HORSENR">{{
                " " + item.HORSENR
              }}</a-typography-text>
            </template>
            <template #description>
              <a-row>
                <a-col :span="24">
                  <a-typography-text v-if="item.TRACKNAME">{{
                    " " + item.TRACKNAME
                  }}</a-typography-text>
                </a-col>
              </a-row>
              <a-row>
                <a-col :span="24">
                  <a-typography-text v-if="item.TAG">{{
                    " " + item.TAG
                  }}</a-typography-text>
                </a-col>
              </a-row>
              <a-row>
                <a-col :span="24">
                  <a-typography-text v-if="item.TEXT">{{
                    " " + item.TEXT
                  }}</a-typography-text>
                </a-col>
              </a-row>
            </template>

            <template #avatar>
              <check-circle-outlined
                :style="{ color: tagColor(item) }"
                v-if="item.State === 'DONE'"
              />
              <sync-outlined
                :style="{ color: tagColor(item) }"
                :spin="true"
                v-if="item.State === 'IN_PROGRESS'"
              />
              <clock-circle-outlined
                v-if="item.State === 'IN_PROGRESS_WITH_DELAY'"
              />
              <close-circle-outlined
                v-if="
                  item.State === 'DONE_WITH_ERROR' ||
                  item.State === 'IN_PROGRESS_WITH_ERROR'
                "
              />
              <stop-outlined v-if="item.State === 'WAITING'" />
              <minus-circle-outlined v-if="item.State === 'STOPPED'" />
            </template>
          </a-list-item-meta>
        </a-list-item>
      </template>
    </a-list>
    <stepsDrawer />
  </a-drawer>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { useRefDataStore } from "@/stores/RefDataStore";
import { useRootStore } from "@/stores/RootStore";
import stepsDrawer from "@/components/stepsDrawer.vue";
import logActions from "@/components/logActions.vue";
import {
  CheckCircleOutlined,
  SyncOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  MinusCircleOutlined,
  StopOutlined,
} from "@ant-design/icons-vue";
export default defineComponent({
  components: {
    stepsDrawer,
    logActions,
    CheckCircleOutlined,
    SyncOutlined,
    CloseCircleOutlined,
    ClockCircleOutlined,
    MinusCircleOutlined,
    StopOutlined,
  },
  setup() {
    const refDataStore = useRefDataStore();
    const rootStore = useRootStore();
    interface Item {
      State: string;
    }
    type TagColor = "success" | "danger" | "warning";
    const tagColor = (item: Item): TagColor => {
      return item.State === "DONE"
        ? "success"
        : item.State === "DONE_WITH_ERROR" ||
          item.State === "IN_PROGRESS_WITH_ERROR"
        ? "danger"
        : "warning";
    };

    return {
      refDataStore,
      rootStore,
      tagColor,
    };
  },
});
</script>
