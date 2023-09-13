<template>
  <button @click="toggleContainer">Toggle Container</button>
  <a-row justify="center" :gutter="16">
    <a-col span="1" />
    <a-col :span="showContainer ? 11 : 22">
      <mainTable />
    </a-col>

    <a-col :span="showContainer ? 11 : 0">
      <div v-if="showContainer" class="scrolling-container">
        <PlaylistBuilderConainer />
      </div>
    </a-col>
    <a-col span="1" />
  </a-row>
  <a-row justify="center">
    <a-col span="24" :style="{ textAlign: 'center' }">Kanal75 ©2023 </a-col>
  </a-row>
  <a-back-top />
</template>
<script lang="ts">
import { defineComponent, ref, Ref } from "vue";
import mainTable from "@/components/mainTable.vue";
import PlaylistBuilderConainer from "@/components/PlaylistBuilderConainer.vue";
import { useWebSocketStore } from "@/stores/WebSocketStore";
import { useRouter } from "vue-router";
export default defineComponent({
  components: {
    mainTable,
    PlaylistBuilderConainer,
  },
  setup() {
    const webSocketStore = useWebSocketStore();
    webSocketStore.connectWebSocket();
    const router = useRouter();
    const currentPath: Ref<string> = ref("");
    router.beforeEach((to, from, next) => {
      const pathWithoutTrailingSlash = to.path.replace(/\/$/, "");
      currentPath.value = pathWithoutTrailingSlash;
      next();
    });
    const showContainer = ref(false); // Initially, show the container

    const toggleContainer = () => {
      showContainer.value = !showContainer.value;
    };
    return {
      webSocketStore,
      showContainer,
      toggleContainer,
    };
  },
});
</script>
<style>
.scrolling-container {
  position: sticky;
  top: 0; /* Adjust as needed, this will stick to the top of the viewport */
  background-color: #f0f0f0; /* Set your desired background color */
  padding: 10px;
  height: 90vh;
}
</style>
