<template>
  <v-row no-gutters>
    <v-col
      cols="4"
    >
      <v-sheet class="ma-2 pa-2">

      </v-sheet>
    </v-col>
    <v-col
      cols="4"
    >
      <v-sheet class="ma-2 pa-2">
        <h2 class="text-h2 font-weight-black">
          Autores
        </h2>
      </v-sheet>
    </v-col>
    <v-col
      cols="4"
    >
      <v-sheet class="ma-2 pa-2">
        <v-btn
          class="ma-2"
          color="primary"
          @click="addItem"
        >
          Novo
          <v-icon
            end
            icon="mdi-plus-circle"
            color="white"
            size="x-large"
          ></v-icon>
        </v-btn>
      </v-sheet>
    </v-col>
  </v-row>


  <v-table>
    <thead>
    <tr>
      <th class="text-center">
        ID
      </th>
      <th class="text-center">
        Nome
      </th>
      <th class="text-center">
        Criado em:
      </th>
      <th class="text-center">
        Ações
      </th>
    </tr>
    </thead>
    <tbody>
    <tr
      v-for="item in items"
      :key="item.id"
    >
      <td>{{ item.id }}</td>
      <td>{{ item.nome }}</td>
      <td>{{ item.created_at }}</td>
      <td>
        <v-icon
          size="small"
          class="me-2"
          @click="editItem(item.id)"
          color="primary"
        >
          mdi-pencil
        </v-icon>
        <v-icon
          size="small"
          @click="deleteItem(item.id)"
          color="red"
        >
          mdi-delete
        </v-icon>
      </td>
    </tr>
    </tbody>
  </v-table>
  <v-dialog
    v-model="dialog"
    fullscreen
    :scrim="false"
    transition="dialog-bottom-transition"
  >
    <v-card>
      <v-toolbar
        dark
        color="primary"
      >
        <v-btn
          icon
          dark
          @click="dialog = false"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>{{ isUpdate ? 'Editar' : "Criar" }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn
            variant="text"
            @click="save"
          >
            {{ isUpdate ? 'Atualizar' : 'Salvar' }}
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-form>
        <v-container>
          <v-row>
            <v-col
              cols="12"
              md="4"
            >
              <v-text-field
                v-model="form.nome"
                :counter="10"
                label="Nome"
                required
                hide-details
              ></v-text-field>
            </v-col>
          </v-row>
        </v-container>
      </v-form>
    </v-card>
  </v-dialog>
</template>
<script setup>
import {onMounted, reactive, ref} from "vue";
import Swal from 'sweetalert2'
import Api from '../../api/Author'

const items = ref([]);
const dialog = ref(false);
const isUpdate = ref(false);

const form = reactive({
  name: '',
});

onMounted(async () => {
  await getAll()
})

const editItem = async (id) => {
  const {data} = await Api.find(id)
  isUpdate.value = true;
  Object.assign(form, {
    id: data.data.id,
    nome: data.data.nome,
  })
  dialog.value = true
}

const addItem = async (id) => {
  Object.assign(form, {
    id: null,
    nome: null,
  })
  dialog.value = true
}

const deleteItem = async (id) => {
  const {ok} = await Api.destroy(id)
  if (ok) {
    await getAll();
  }
}

const getAll = async () => {
  const {data} = await Api.getAll()
  items.value = data.data
}

const save = async () => {
  if (form.id) {
    const {ok} = await Api.update(form.id, form);
    if (ok) {
      dialog.value = false;
      Swal.fire({
        icon: "success",
        title: "Atualizado com sucesso",
        showConfirmButton: false,
        timer: 1500
      });
      await Api.getAll()
    }
  } else {
    const {ok} = await Api.save(form);
    if (ok) {
      dialog.value = false;
      Swal.fire({
        icon: "success",
        title: "Salvo com sucesso",
        showConfirmButton: false,
        timer: 1500
      });
      await Api.getAll()
    }
  }

}

</script>

