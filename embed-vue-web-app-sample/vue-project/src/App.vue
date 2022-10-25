<template>
  <div id="webapp">
    <nav>
      <RouterLink :to="{name: 'home'}" title="hf_use_description">Home</RouterLink>
      <RouterLink :to="{name: 'sample'}" title="hf_use_description">Sample</RouterLink>
      <RouterLink :to="{name: 'about'}" title="hf_use_description">About</RouterLink>
    </nav>
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
</script>

<style scoped>
#webapp {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100vw;
  padding: 0rem 2rem;
}

nav {
  font-size: 12px;
  text-align: center;
  margin-bottom: 1rem;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  nav {
    text-align: left;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
