<script setup>
import axios from "axios";
import { ref } from "vue";

const props = defineProps({
  notesList: Function,
});

const title = ref('');
const body = ref('');

const createData = async () => {
  if (title.value != "" && body.value != "")
    axios.post(`http://localhost:5000/notes`, {
      title: title.value,
      date: new Date().toISOString(),
      body: body.value,
    })
      .then(() => {
        props.notesList();
        title.value = "";
        body.value = "";
      })
      .catch(err => {
        console.log(err);
      })
};

</script>

<template>
  <form @submit.prevent class="flex flex-col gap-5">
    <input class="p-3 bg-transparent border-[1px] border-white rounded" type="text" v-model="title"
      placeholder="Title here ..." required />
    <textarea class="p-3 bg-transparent border-[1px] border-white rounded min-h-[175px]" type="text" v-model="body"
      placeholder="Your note here ..." required />
    <button type="submit" class="p-3 bg-transparent border-[1px] border-white rounded" @click="createData">Submit</button>
  </form>
</template>
