<template>
  <q-page padding>

    <div class="q-pa-md q-gutter-sm">
      <q-breadcrumbs>
        <q-breadcrumbs-el label="home" icon="home" to="/" />
        <q-breadcrumbs-el label="situações" />
      </q-breadcrumbs>
    </div>

    <div class="row justify-center">
      <div class="col-6">
        <q-form
          class="q-gutter-md q-mt-lg"
        >
          <q-input
            filled
            v-model="situacao.name"
            label="Situação *"
            hint="Digite o nome da situação"
          />
          <div>
            <q-btn @click="gravar()" label="adicionar" color="primary" to="/situacoes"/>
            <q-btn @click="reset()" label="limpar" color="primary" flat class="q-ml-sm"/>
          </div>
        </q-form>
        <q-page padding>
          <template>
            <div class="q-pa-md">
              <q-table
               title="Situações Cadastradas:"
               :data="situations"
               :columns="colunas"
               row-key="uuid"
               selection="single"
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
      situations: [],
      colunas: [
        { name: 'name', align: 'middle', label: 'Nome', field: 'name', sortable: true }
      ],
      situacao: {
        name: '',
        uuid: ''
      },
      selected: []
    }
  },

  mounted () {
    this.buscarSituations()
  },

  methods: {
    gravar () {
      const cloned = JSON.parse(JSON.stringify(this.situacao))
      this.$axios.post('http://localhost:8083/situation', cloned)
      this.reset()
      this.buscarSituations()
    },

    reset () {
      this.situacao.name = ''
    },
    buscarSituations () {
      this.$axios.get('http://localhost:8083/situation')
        .then((response) => {
          this.situations = response.data
        })
    },
    removeRow () {
      console.log(JSON.stringify((this.selected)))
      var recebeArray = (this.selected[0])
      var recebeUuid = JSON.parse(JSON.stringify(recebeArray, ['uuid']), [0])
      this.$axios.delete('http://localhost:8083/situation/' + recebeUuid.uuid)
      this.buscarSituations()
    }
  }
}
</script>
