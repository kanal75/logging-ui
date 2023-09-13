<template>
  <div class="playlist-builder-continer">
    <PlaylistBuilder
      v-for="playlist in playlists"
      :playlist="playlist"
      :key="playlist.id"
    ></PlaylistBuilder>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import PlaylistBuilder from "./PlaylistBuilder.vue";

export interface Playlist {
  id: string;
  name: string;
  color: string;
  description: string;
}

export default defineComponent({
  name: "PlaylistBuilderContainer",
  components: { PlaylistBuilder },
  setup() {
    //TODO
    const playlists: Playlist[] = [
      {
        id: "playlist1",
        name: "Playlist 1",
        color: "blue",
        description: "Spellista MED grafik",
      },
      {
        id: "playlist2",
        name: "Playlist 2",
        color: "red",
        description: "Spellista UTAN grafik",
      },
    ];

    return { playlists };
  },
});
</script>

<style lang="scss" scoped>
.page-style-dark {
  .playlist-builder-continer {
    background-color: #0d1117;
    border: 1px solid #282e35;
    color: #c9d1d9;
  }
}
.playlist-builder-continer {
  background-color: #ecf1f8;
  border: 1px solid #b4b4b4;
  color: #000;
}
</style>
