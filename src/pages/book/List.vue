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
          Livros
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
        Título
      </th>
      <th class="text-center">
        Editora
      </th>
      <th class="text-center">
        Edição
      </th>
      <th class="text-center">
        Ano de publicação
      </th>
      <th class="text-center">
        Valor R$
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
      <td>{{ item.titulo }}</td>
      <td>{{ item.editora }}</td>
      <td>{{ item.edicao }}</td>
      <td>{{ item.anoPublicacao }}</td>
      <td>{{ item.valor_formatted }}</td>
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
                name="titulo"
                v-model="form.titulo"
                type="text"
                v-slot="{ field, errors }"
              >
                <v-text-field
                  v-model="form.titulo"
                  v-bind="field"
                  variant="outlined"
                  :error-messages="errors"
                  required
                  type="text"
                  label="Título"
                />
              </Field>
            </v-col>
            <v-col
              cols="12"
              md="4"
            >
              <Field
                name="editora"
                v-model="form.editora"
                type="text"
                v-slot="{ field, errors }"
              >
                <v-text-field
                  v-model="form.editora"
                  v-bind="field"
                  variant="outlined"
                  :error-messages="errors"
                  required
                  type="text"
                  label="Editora"
                />
              </Field>
            </v-col>
            <v-col
              cols="12"
              md="4"
            >
              <Field
                name="edicao"
                v-model="form.edicao"
                type="text"
                v-slot="{ field, errors }"
              >
                <v-text-field
                  v-model="form.edicao"
                  v-bind="field"
                  variant="outlined"
                  :error-messages="errors"
                  required
                  type="text"
                  label="Edição"
                />
              </Field>
            </v-col>
            <v-col
              cols="12"
              md="4"
            >
              <Field
                name="anoPublicacao"
                v-model="form.anoPublicacao"
                type="text"
                v-slot="{ field, errors }"
              >
                <v-text-field
                  v-model="form.anoPublicacao"
                  v-bind="field"
                  variant="outlined"
                  :error-messages="errors"
                  required
                  type="text"
                  label="Ano publicação"
                />
              </Field>
            </v-col>
            <v-col
              cols="12"
              md="4"
            >
              <VCurrencyField v-model="form.valor" label="Valor" name="valor" variant="outlined"/>
            </v-col>
            <v-col
              cols="12"
              md="6"
            >
              <v-select
                chips
                multiple
                v-model="form.author_id"
                :items="authorsList"
                name="author_id"
                variant="outlined"
                label="Autores"
                required
                class="required"
              ></v-select>
            </v-col>
            <v-col
              cols="12"
              md="6"
            >
              <v-select
                chips
                multiple
                v-model="form.subject_id"
                :items="subjectsList"
                name="subject_id"
                variant="outlined"
                label="Assuntos"
                required
                class="required"
              ></v-select>
            </v-col>
          </v-row>
        </v-container>
      </Form>
    </v-card>
  </v-dialog>
</template>
<script setup>
import {onMounted, reactive, ref} from "vue";
import * as yup from 'yup';
import {Field, Form} from 'vee-validate';
import Swal from 'sweetalert2'

import VCurrencyField from '../../components/VCurrencyField'
import Api from '../../api/Book'

const items = ref([]);
const dialog = ref(false);
const isUpdate = ref(false);
const isValidForm = ref(false);

const author = ref('');
const subject = ref('');

const authorsList = ref([]);
const subjectsList = ref([]);

const form = reactive({
  titulo: '',
  editora: '',
  edicao: '',
  anoPublicacao: '',
  valor: '',
  author_id: [],
  subject_id: [],
});

const rules = yup.object({
  titulo: yup
    .string()
    .min(3, 'Campo deve ter no mínimo 3 caracteres')
    .max(40, 'Campo de ter no máximo 40 caracteres')
    .required('Campo obrigatório'),
  editora: yup
    .string()
    .min(3, 'Campo deve ter no mínimo 3 caracteres')
    .max(4040, 'Campo de ter no máximo 40 caracteres')
    .required('Campo obrigatório'),
  edicao: yup
    .number()
    .typeError('Apenas números')
    .required('Campo obrigatório'),
  anoPublicacao: yup
    .number()
    .typeError('Apenas números')
    .required('Campo obrigatório'),
  valor: yup
    .string()
    .required('Campo obrigatório'),
  author_id: yup
    .string()
    .required('Campo obrigatório'),
  subject_id: yup
    .string()
    .required('Campo obrigatório'),
})

const validateForm = (meta) => {
  isValidForm.value = false
  if (meta.dirty && meta.valid) {
    isValidForm.value = true
  }
}

onMounted(async () => {
  await getAll()
  await preRequisite()
})

const preRequisite = async () => {
  const {data} = await Api.preRequisite();
  authorsList.value = await data.data.preRequisite.authors
  subjectsList.value = await data.data.preRequisite.subjects


}

const editItem = async (id) => {
  const {data} = await Api.find(id)
  isUpdate.value = true;
  Object.assign(form, {
    id: data.data.id,
    titulo: data.data.titulo,
    editora: data.data.editora,
    edicao: data.data.edicao,
    anoPublicacao: data.data.anoPublicacao,
    valor: data.data.valor,
    author_id: data.data.authors.map((author) => author.author_id),
    subject_id: data.data.subjects.map((subject) => subject.subject_id),
  })
  dialog.value = true
}

const addItem = async () => {
  Object.assign(form, {
    id: null,
    titulo: null,
    editora: null,
    edicao: null,
    anoPublicacao: null,
    valor: null,
    author_id: [],
    subject_id: []
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
      Swal.fire({
        icon: "success",
        title: "Atualizado com sucesso",
        showConfirmButton: false,
        timer: 1500
      });
      await getAll()
    }
  } else {
    const {ok} = await Api.save(form);
    if (ok) {
      Swal.fire({
        icon: "success",
        title: "Salvo com sucesso",
        showConfirmButton: false,
        timer: 1500
      });
      await getAll()
    }
  }
  dialog.value = false;
}

</script>

