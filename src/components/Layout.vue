<template>
  <v-app id="inspire">
    <v-app-bar
      class="px-3"
      flat
      density="compact"
      color="primary"
    >
      <v-spacer></v-spacer>

      <v-bottom-navigation :elevation="17" grow color="primary">
        <v-btn
          value="recent"
          @click="goToRoute('/books/list')"
        >
          <v-icon>mdi-book</v-icon>

          <span>Livros</span>
        </v-btn>

        <v-btn
          value="favorites"
          @click="goToRoute('/authors/list')"
        >
          <v-icon>mdi-account-supervisor</v-icon>

          <span>Autores</span>
        </v-btn>

        <v-btn
          value="nearby"
          @click="goToRoute('/subjects/list')"
        >

          <span>Assuntos</span>
        </v-btn>

        <v-btn
          value="nearby"
          @click="generateRelatorio()"
        >
          <v-icon>mdi-file-pdf-box</v-icon>

          <span>Relatório</span>
        </v-btn>
      </v-bottom-navigation>
      <v-spacer></v-spacer>

    </v-app-bar>

    <v-main class="bg-grey-lighten-3">
      <v-container>
        <v-row>
          <v-col
            cols="12"
            md="2"
          >
            <v-sheet
              rounded="lg"
              min-height="268"
              color="primary"
              elevation="12"
            >
              <!--  -->
            </v-sheet>
          </v-col>

          <v-col
            cols="12"
            md="8"
          >
            <v-sheet
              elevation="12"
              min-height="70vh"
              rounded="lg"
              class="center text-center"
            >
              <router-view></router-view>
            </v-sheet>
          </v-col>

          <v-col
            cols="12"
            md="2"
          >
            <v-sheet
              rounded="lg"
              min-height="268"
              color="primary"
              elevation="12"
            >
              <!--  -->
            </v-sheet>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import axios from 'axios'
import {ref} from 'vue';
import router from '../router'

const tab = ref

const links = [
  'Livros',
  'Autores',
  'Assuntos',
]

const generateRelatorio = async () => {
  axios({
    url: 'http://localhost/api/report',
    method: 'POST',
    responseType: 'blob', // important
  }).then((response) => {
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'report.pdf');
    document.body.appendChild(link);
    link.click();
  });
}


const goToRoute = (route) => {
  router.push(route)
}

</script>

