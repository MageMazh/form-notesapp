<script setup>
import { ref } from 'vue'
import { useQuery } from "vue-query";
import axios from "axios";

import Navbar from '../components/Navbar.vue';
import FormInput from '../components/FormInput.vue';

const titleUpdate = ref('');
const bodyUpdate = ref('');

const notes = ref([]);
const isLoading = ref(false);
const isError = ref(null);
const isModalOpen = ref(false);
const updating = ref('');

const fetchData = async ({ queryKey }) => {
  const [key] = queryKey;
  const { data } = await axios.get(`http://localhost:5000/notes`);

  if (data.status) {
    return data;
  } else {
    throw new Error(`${key}/ Failed to fetch data`);
  }
}

const deleteData = async (id) => {
  try {
    await axios.delete(`http://localhost:5000/notes/${id}`);
    notesList();
  } catch (error) {
    console.error(error);
  }
}

const updateData = async (id) => {
  try {
    await axios.put(`http://localhost:5000/notes/${id}`, {
      title: titleUpdate.value,
      date: new Date().toISOString(),
      body: bodyUpdate.value,
    });
    closeModal();
    notesList();
  } catch (error) {
    console.error(error);
  }
}

const showModal = (chooseTitle, chooseBody, id) => {
  isModalOpen.value = true;
  updating.value = id;
  titleUpdate.value = chooseTitle;
  bodyUpdate.value = chooseBody;
}

const closeModal = () => {
  isModalOpen.value = false;
  updating.value = '';
  titleUpdate.value = '';
  bodyUpdate.value = '';
}

const showFormattedDate = (input) => {
  const inputDate = new Date(input);
  const daysOfWeek = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  const day = daysOfWeek[inputDate.getUTCDay()];

  const year = inputDate.getUTCFullYear();
  const month = String(inputDate.getUTCMonth() + 1).padStart(2, "0");
  const date = String(inputDate.getUTCDate()).padStart(2, "0");

  const formattedDate = `${day}, ${date}-${month}-${year}`;

  return formattedDate;
}

const notesList = () => {
  const { isLoading, isError, data } = useQuery(
    "notes",
    fetchData
  );

  notes.value = data;
  isLoading.value = isLoading;
  isError.value = isError;
}

notesList();

</script>

<template>
  <div v-if="isModalOpen" class="fixed inset-0 flex items-center justify-center z-50">
    <div class="bg-gray-800 bg-opacity-50 absolute inset-0" @click="closeModal"></div>

    <div class="bg-black p-4 rounded shadow-lg z-10">
      <h2 class="text-xl font-semibold mb-4">Add Note</h2>

      <form @submit.prevent>
        <div class="mb-4">
          <label class="block text-sm font-medium">Title</label>
          <input v-model="titleUpdate" type="text" class="w-full mt-1 p-2 border rounded-md text-black"
            placeholder="judul baru" required />
        </div>

        <div class="mb-4">
          <label class="text-sm font-medium">Body</label>
          <textarea v-model="bodyUpdate" type="text" class="w-full mt-1 p-2 border rounded-md min-h-[175px] text-black"
            placeholder="deskripsi baru" required />
        </div>

        <div class="text-right">
          <button type="button" @click="closeModal" class="px-4 py-2 text-sm font-medium bg-red-500 rounded-lg">
            Cancel
          </button>
          <button type="submit" @click="updateData(updating)"
            class="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 ml-4">
            Save
          </button>
        </div>
      </form>
    </div>
  </div>

  <Navbar />
  <div class="flex flex-col gap-5 justify-center p-10">
    <h2 class="text-xl">Create Your New Note</h2>
    <FormInput :notesList="notesList" />
  </div>
  <div class="px-10">
    <h2 class="mb-4 text-xl">Your Note(s)</h2>
    <div v-if="isLoading">Loading...</div>
    <div v-else-if="isError">An error has occurred</div>
    <div v-else>
      <ul className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 grid-rows-[min-content,max-content] gap-5 mb-12">
        <li v-for="item in notes.value.data.notes" :key="item.id">
          <div class="flex flex-col h-52 border-[1px] border-white overflow-hidden rounded">
            <div class="flex-1 mb-5">
                <p class="text-xl font-semibold my-1 ml-2">{{ item.title }}</p>
                <p class="mb-1 ml-2 text-xs font-light color-[#9ca3af]">{{ showFormattedDate(item.date) }}</p>
              <div class="border-b-[1px]"></div>
              <p class="whitespace-normal my-2 ml-2 text-sm line-clamp-3">{{ item.body }}</p>
            </div>
            <div class="flex justify-end gap-4 m-2">
              <button class="bg-blue-600 rounded p-1 w-16"
                @click="() => showModal(item.title, item.body, item.id)">Edit</button>
              <button class="bg-red-600 rounded p-1 w-16" @click="() => deleteData(item.id)">Delete</button>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
