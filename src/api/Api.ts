import axios from 'axios';
import Swal from 'sweetalert2'

export default class Api {
  protected url: string;

  constructor(url: string) {
    this.url = 'http://localhost/api/' + url;
  }

  async getAll() {
    try {
      return await axios.get(`${this.url}`).then((res) => ({
        status: true,
        data: res.data,
      })).catch((err) =>
        // notification.showErrors(err);
        ({
          status: false,
          error: err.message,
          description: err.response.data.message,
        }));
    } catch (error) {
      return error;
    }
  }

  async find(id: number | string) {
    try {
      return await axios.get(`${this.url}/${id}`).then((res) => ({
        status: res.status,
        data: res.data,
      })).catch((err) =>
        // notification.showErrors(err);
        ({
          status: false,
          error: err.message,
          description: err.response.data.message,
        }));
    } catch (error) {
      return {
        status: false,
        error,
        description: null,
      };
    }
  }

  async update(id: string | number, data: any) {
    try {
      return await axios
        .put(`${this.url}/${id}`, data)
        .then((res: any) => this.success(res))
        .catch((err) => this.fail(err));
    } catch (error) {
      return error;
    }
  }

  async save(data: any) {
    try {
      return await axios
        .post(this.url, data)
        .then((res: any) => this.success(res))
        .catch((err) => this.fail(err));
    } catch (error) {
      return error;
    }
  }

  async destroy(id: number) {
    return await Swal.fire({
      title: 'Deseja excluir?',
      text: 'Cuidado, exclusão permanente',
      icon: 'error',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonColor: 'rgba(28,72,190,0.8)',
      cancelButtonColor: '#a89f9f',
      confirmButtonText: 'Sim',
    }).then(async (result: any) => {
      if (result.value) {
        return await axios.delete(`${this.url}/${id}`).then(res => {
          if (res.data.data.type === 'success') {
            Swal.fire(
              {
                title: 'Excluído',
                icon: 'success',
                confirmButtonText: 'Fechar',
                timer: 1500,
                confirmButtonColor: '#3085d6',
              })

            return {
              status: true,
              ok: true
            };
          } else {
            Swal.fire('Item não excluído', '', 'error');
            return {
              status: false,
              ok: false
            };
          }
        }).catch(err => {
          this.fail(err)
        });
      } else {
        return {
          status: false,
        };
      }
    });
  }

  async preRequisite(id = null) {
    try {
      let url = `${this.url}/pre-requisite`;
      if (id) {
        url = `${url}/${id}`;
      }
      return await axios
        .get(url)
        .then((res) => this.success(res))
        .catch((err) => this.fail(err));
    } catch (error) {
      return {
        status: false,
        error,
        description: null,
      };
    }
  }

  async success(success: any) {
    return {
      ok: true,
      ...success,
    };
  }

  fail(error: any) {
    return {
      ok: false,
      error,
    }
  }

  getUrl() {
    return this.url;
  }
}
