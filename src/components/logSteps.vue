<template>
  <a-steps size="small" direction="vertical">
    <a-step
      v-for="(node, index) in rootStore.nodes"
      :key="index"
      :title="node.Name"
      :status="
        node.State === 'DONE'
          ? 'finish'
          : node.State === 'DONE_WITH_ERROR' || node.State === 'PRECEDING_ERROR'
          ? 'error'
          : node.State === 'IN_PROGRESS' ||
            node.State === 'IN_PROGRESS_WITH_DELAY'
          ? 'process'
          : node.State === 'WAITING'
          ? 'wait'
          : 'default'
      "
    >
      <template #description>
        <div>
          <span v-if="node.State === 'DONE'">{{ node.Duration }}</span>
          <span v-else-if="node.State === 'IN_PROGRESS_WITH_DELAY'">
            <a-statistic-countdown :value="deadline(node.MilliSeconds)" />
          </span>
          <span v-else>{{ node.State }}</span>
        </div>
      </template>
      <template #icon>
        <template v-if="node.State === 'DONE'">
          <check-circle-outlined :style="{ color: 'green' }" />
        </template>
        <template v-if="node.State === 'IN_PROGRESS'">
          <loading-outlined :style="{ color: 'orange' }" />
        </template>
        <template
          v-if="
            node.State === 'DONE_WITH_ERROR' || node.State === 'PRECEDING_ERROR'
          "
        >
          <close-circle-outlined :style="{ color: 'red' }" />
        </template>
        <template v-if="node.State === 'STOPPED'">
          <stop-outlined />
        </template>
        <template v-if="node.State === 'WAITING'">
          <pause-circle-outlined />
        </template>
        <template v-if="node.State === 'IN_PROGRESS_WITH_DELAY'">
          <clock-circle-outlined />
        </template>
      </template>
    </a-step>
  </a-steps>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import {
  LoadingOutlined,
  StopOutlined,
  CheckCircleOutlined,
  PauseCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons-vue";
import moment from "moment";
import { useRootStore } from "@/stores/RootStore";
export default defineComponent({
  components: {
    LoadingOutlined,
    StopOutlined,
    CheckCircleOutlined,
    PauseCircleOutlined,
    ClockCircleOutlined,
    CloseCircleOutlined,
  },
  setup() {
    const rootStore = useRootStore();
    const deadline = (MilliSeconds: string): moment.Moment => {
      const targetDate = moment(rootStore.selectedMedia.StartTime);
      const currentDate = moment();
      const countdownTime = targetDate.diff(currentDate) + MilliSeconds;
      return moment().add(countdownTime, "milliseconds");
    };

    return { rootStore, deadline };
  },
});
</script>
