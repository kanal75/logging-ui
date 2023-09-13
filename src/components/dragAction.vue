<template>
  <draggable
    style="display: inline"
    v-model="itemarray"
    item-key="ID"
    :group="{ name: 'Media list', pull: 'clone', put: false }"
    @clone="onclone"
    ><template #item="{ element }">
      <a style="font-size: 20px" :data="element.ID"><drag-outlined /></a>
    </template>
  </draggable>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import draggable from "vuedraggable";
import { useMediaStore } from "@/stores/index";
import { storeToRefs } from "pinia";
import { DragOutlined } from "@ant-design/icons-vue";
export default defineComponent({
  components: {
    DragOutlined,
    draggable,
  },
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const store = useMediaStore();
    const { draggedMedia } = storeToRefs(store);
    const itemarray = [props.item];
    function onclone(e: any) {
      console.log("CLONE", e);
      draggedMedia.value = props.item;
      return e;
    }
    return {
      itemarray,
      onclone,
    };
  },
});
</script>
