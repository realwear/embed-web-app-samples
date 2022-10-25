<template>
  <div>
    <div class="element">
      Standard text field:
      <!-- hf_use_description tells our device to use 'placeholder' as the voice command. For more info on HF attributes, see https://support.realwear.com/knowledge/hmt-development-html -->
      <input v-model="standardTextField" type="text" placeholder="Standard text field" title="hf_use_description">
    </div>

    <div class="element">
      Number field:
      <!-- input types of 'number' don't support hf_use_description. By specifying '|number field' at the end, we can say what voice command we want. -->
      <input v-model="numberField" type="number" placeholder="Number field" title="hf_use_description|number field">
    </div>

    <div class="element">
      Password field:
      <input v-model="passwordField" type="password" placeholder="Password field" title="hf_use_description">
    </div>

    <button :onclick="showInfo">
      Button
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const standardTextField = ref("")
const numberField = ref("")
const passwordField = ref("")

function showInfo() {
  alert(
`Standard text field value: "${standardTextField.value}"
Number field value: "${numberField.value}"
Password field value: "${passwordField.value}"`
  )
}

</script>

<style scoped>
.element {
  margin: 20px 0;
}
</style>