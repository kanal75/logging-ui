<template>
  <a-drawer
    v-model:visible="refDataStore.stepsDrawer"
    :title="
      (rootStore.selectedMedia.TRACKNAME
        ? rootStore.selectedMedia.TRACKNAME + ' '
        : '') +
      (rootStore.selectedMedia.TYPE ? rootStore.selectedMedia.TYPE + ' ' : '') +
      (rootStore.selectedMedia.RACENR
        ? rootStore.selectedMedia.RACENR + ' '
        : '') +
      (rootStore.selectedMedia.HORSENR
        ? rootStore.selectedMedia.HORSENR + ' '
        : '') +
      (rootStore.selectedMedia.TAG ? rootStore.selectedMedia.TAG + ' ' : '') +
      (rootStore.selectedMedia.TEXT ? rootStore.selectedMedia.TEXT : '')
    "
    width="500"
    :closable="false"
  >
    <logSteps />
    <template #title> </template>
    <template #footer>
      <a-row>
        <a-col span="12">
          <a-typography-title :level="5">Start Time</a-typography-title>
          <a-typography-text>
            {{ rootStore.selectedMedia.StartTime }}
          </a-typography-text>
        </a-col>
        <a-col span="12">
          <a-typography-title :level="5">Clip Duration</a-typography-title>
          <a-typography-text>
            {{ rootStore.selectedMedia.DURATION }}
          </a-typography-text>
        </a-col>
      </a-row>
    </template>
  </a-drawer>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { useRootStore } from "@/stores/RootStore";
import { useRefDataStore } from "@/stores/RefDataStore";
import logSteps from "@/components/logSteps.vue";
export default defineComponent({
  components: {
    logSteps,
  },
  setup() {
    const rootStore = useRootStore();
    const refDataStore = useRefDataStore();
    return { rootStore, refDataStore };
  },
});
</script>
