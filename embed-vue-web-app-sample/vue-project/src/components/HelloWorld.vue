<template>
  <div class="greetings">
    <h1 class="green">{{ msg }}</h1>
    <h3>
      Have a play with the example UI elements below to see how they interact with our voice-enabled devices.
    </h3>
    <h3>
      Use <code>npm run dev-android</code> to quickly preview this sample on your device, to test our voice features for instance.
    </h3>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  msg: string;
}>();
</script>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  top: -10px;
}

code {
  border-radius: 8px;
  background-color: #000;
  color: #fff;
  padding: 2px 4px;
}

h3 {
  font-size: 1.2rem;
  padding: 8px 0;
}

.greetings h1,
.greetings h3 {
  text-align: center;
}

@media (min-width: 1024px) {

  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}
</style>
