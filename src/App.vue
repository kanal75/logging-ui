<template>
  <mainPage />
</template>
<script>
import mainPage from "./components/mainPage.vue";
import { defineComponent } from "vue";
export default defineComponent({
  name: "App",
  components: {
    mainPage,
  },
});
</script>
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
.ant-statistic-content {
  font-size: 14px !important;
  color: rgba(0, 0, 0, 0.45) !important;
}
.ant-steps-vertical > .ant-steps-item .ant-steps-item-description {
  padding-bottom: 9px !important;
}
.ant-tag,
.ant-tag a,
.ant-tag a:hover {
  color: rgba(0, 0, 0, 0.85) !important;
  font-size: 14px !important;
}
table tr td {
  padding: 0px;
}
</style>
