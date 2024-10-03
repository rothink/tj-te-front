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
        <h5 class="text-h5 font-weight-black">
          Autores
        </h5>
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

      <Form
        as="v-form"
        :validation-schema="rules"
        v-slot="{meta}"
      >
        {{ validateForm(meta) }}
        <v-container>
          <v-row>
            <v-col
              cols="12"
              md="4"
            >
              <Field
                name="nome"
                v-model="form.nome"
                type="text"
                v-slot="{ field, errors }"
              >
                <v-text-field
                  v-model="form.nome"
                  v-bind="field"
                  variant="outlined"
                  :error-messages="errors"
                  label="Nome"
                  required
                  class="required"
                ></v-text-field>
              </Field>
            </v-col>
          </v-row>
        </v-container>
      </Form>
    </v-card>
  </v-dialog>
</template>
<script setup>


import {onMounted, reactive, ref} from "vue";
import Swal from 'sweetalert2'
import * as yup from 'yup';
import {Field, Form} from 'vee-validate';

import Api from '../../api/Author'

const items = ref([]);
const dialog = ref(false);
const isUpdate = ref(false);
const isValidForm = ref(false);

const form = reactive({
  nome: '',
});

const rules = yup.object({
  nome: yup
    .string()
    .min(3, 'Campo deve ter no mínimo 3 caracteres')
    .max(255, 'Campo de ter no máximo 255 caracteres')
    .required('Campo obrigatório')
})

const validateForm = (meta) => {
  isValidForm.value = false
  if (meta.dirty && meta.valid) {
    isValidForm.value = true
  }
}

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
      await getAll()
      Swal.fire({
        icon: "success",
        title: "Atualizado com sucesso",
        showConfirmButton: false,
        timer: 1500
      });
    }
  } else {
    const {ok} = await Api.save(form);
    if (ok) {
      await getAll()
      Swal.fire({
        icon: "success",
        title: "Salvo com sucesso",
        showConfirmButton: false,
        timer: 1500
      });
    }
  }
  dialog.value = false;
}

</script>

