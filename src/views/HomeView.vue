<template>
  <div class="home">
    <mainPage />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import mainPage from "@/components/mainPage.vue"; // @ is an alias to /src

@Options({
  components: {
    mainPage,
  },
})
export default class HomeView extends Vue {}
</script>
