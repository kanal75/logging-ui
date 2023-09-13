<template>
  <a-popover>
    <template #content> Details </template>
    <a
      style="font-size: 20px"
      @click="
        (refDataStore.stepsDrawer = true),
          rootStore.getNodes(item.ID, item.TRACKNAME, item.TYPE),
          (rootStore.selectedMedia = item)
      "
      ><file-done-outlined
    /></a>
  </a-popover>
  <a-divider type="vertical" />
  <a-popconfirm
    title="Are you sure to resend the log?"
    ok-text="Yes"
    cancel-text="No"
    @confirm="
      rootStore.fetchMediaLog(
        item.EVENTDATE,
        item.TRACKNAME,
        item.TYPE,
        item.ID
      )
    "
  >
    <a-popover>
      <template #content> Relog </template>
      <a style="font-size: 20px"><redo-outlined /></a>
    </a-popover>
  </a-popconfirm>
  <a-divider type="vertical" />
  <a-popconfirm
    :disabled="item.State === 'DONE' ? true : false"
    title="Are you sure to Stop the log?"
    ok-text="Yes"
    cancel-text="No"
    @confirm="rootStore.stopLog(item.URL)"
  >
    <a-popover>
      <template #content> Stop </template>
      <a v-if="item.State !== 'DONE'" style="font-size: 20px"
        ><stop-outlined
      /></a>
      <a v-else style="font-size: 20px" disabled><stop-outlined /></a>
    </a-popover>
  </a-popconfirm>
  <a-divider type="vertical" />
  <a-popconfirm
    title="Are you sure to delete the log?"
    ok-text="Yes"
    cancel-text="No"
    @confirm="
      rootStore.deleteLog(item.EVENTDATE, item.TRACKNAME, item.TYPE, item.ID)
    "
  >
    <a-popover>
      <template #content> Delete </template>
      <a style="font-size: 20px"><delete-outlined /></a>
    </a-popover>
  </a-popconfirm>
  <a-divider type="vertical" />
  <a-popover>
    <template #content> Debug </template>
    <a
      style="font-size: 20px"
      @click="
        refDataStore.showJson(
          item.EVENTDATE,
          item.TRACKNAME,
          item.TYPE,
          item.ID
        )
      "
      ><bug-outlined
    /></a>
  </a-popover>
  <a-divider type="vertical" />
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { useRootStore } from "@/stores/RootStore";
import { useRefDataStore } from "@/stores/RefDataStore";
import {
  StopOutlined,
  FileDoneOutlined,
  RedoOutlined,
  DeleteOutlined,
  BugOutlined,
} from "@ant-design/icons-vue";
export default defineComponent({
  components: {
    StopOutlined,
    FileDoneOutlined,
    RedoOutlined,
    DeleteOutlined,
    BugOutlined,
  },
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  setup() {
    const rootStore = useRootStore();
    const refDataStore = useRefDataStore();
    return {
      rootStore,
      refDataStore,
    };
  },
});
</script>
