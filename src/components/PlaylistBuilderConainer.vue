<template>
  <div class="playlist-builder-continer">
    <PlaylistBuilder
      v-for="playlist in playlists"
      :key="playlist.id"
      :playlist="playlist"
      :size-divider="playlists.length"
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
  defaultTiming?: number;
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
        color: "0000ff",
        description: "Spellista MED grafik",
      },
      {
        id: "playlist2",
        name: "Playlist 2",
        color: "ff0000",
        description: "Spellista UTAN grafik",
      },
    ];

    return { playlists };
  },
});
</script>

<style lang="scss">
.page-style-dark {
  .playlist-builder-continer {
    background-color: #0d1117;
    color: #c9d1d9;
  }
}
.playlist-builder-continer {
  background-color: #ecf1f8;
  color: #000;
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>
