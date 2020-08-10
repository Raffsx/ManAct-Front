<template>
  <q-page padding>

    <div class="q-pa-md q-gutter-sm">
      <q-breadcrumbs>
        <q-breadcrumbs-el label="home" icon="home" to="/" />
        <q-breadcrumbs-el label="tipos" />
      </q-breadcrumbs>
    </div>

    <div class="row justify-center">
      <div class="col-6">
        <q-form
          class="q-gutter-md q-mt-lg"
        >
          <q-input
            filled
            v-model="tipos.name"
            label="Tipo *"
            hint="Digite o nome do tipo"
          />
          <div>
            <q-btn @click="gravar()" label="adicionar" color="primary" to="/tipos"/>
            <q-btn @click="reset()" label="limpar" type="reset" color="primary" flat class="q-ml-sm" />
          </div>
          </q-form>
         <q-page padding>
          <template>
            <div class="q-pa-md">
              <q-table
               title="Tipos Cadastradas:"
               :data="types"
               :columns="colunas"
               row-key="uuid"
               selection="single"
               :loading="loading"
               :selected.sync="selected"
              />
            </div>
          </template>
          <template>
            <q-btn class="q-ml-sm" color="primary" label="Remove row" @click="removeRow()"/>
          </template>
        </q-page>
      </div>

    </div>

  </q-page>
</template>

<script>
export default {
  data () {
    return {
      loading: false,
      types: [],
      colunas: [
        { name: 'name', align: 'middle', label: 'Nome', field: 'name', sortable: true }
      ],
      tipos: {
        name: '',
        uuid: ''
      },
      selected: []
    }
  },

  mounted () {
    this.buscarTypes()
  },

  methods: {
    gravar () {
      const cloned = JSON.parse(JSON.stringify(this.tipos))
      this.$axios.post('http://localhost:8083/type', cloned)
      this.reset()
      this.buscarTypes()
    },

    reset () {
      this.tipos.name = ''
    },
    buscarTypes () {
      this.loading = true
      this.$axios.get('http://localhost:8083/type')
        .then((response) => {
          this.types = response.data
        })
      this.types = []
      this.loading = false
    },
    removeRow () {
      console.log(JSON.stringify((this.selected)))
      var recebeArray = (this.selected[0])
      var recebeUuid = JSON.parse(JSON.stringify(recebeArray, ['uuid']), [0])
      this.$axios.delete('http://localhost:8083/type/' + recebeUuid.uuid)
      this.buscarTypes()
    }
  }

}
</script>
