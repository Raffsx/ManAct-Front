<template>

  <q-page padding>

    <div class="q-pa-md q-gutter-sm">
      <q-breadcrumbs>
        <q-breadcrumbs-el label="home" icon="home" to="/" />
        <q-breadcrumbs-el label="atividades" />
      </q-breadcrumbs>
    </div>

    <div class="row justify-center">
      <div class="col-6">
        <q-form
          class="q-gutter-md q-mt-lg">

          <q-input
            filled
            v-model="modelName"
            label="Atividade *"
            hint="Digite o nome da atividade"
          />

          <q-input
            filled
            v-model="modelDescription"
            label="Descrição *"
            hint="Descreva a atividade"
          />

          <div class="col-4">
            <q-select filled
              v-model="modelType"
              option-value="id"
              :options="type"
              option-label="name"
              label="Tipo *"
              />
            </div>
          <div class="row justify-left q-gutter-md row items-start"> </div>

          <div class="col-5">
            <q-select filled
              v-model="modelSituation"
              :options="situation"
              option-label="name"
              label="Situação *"
              />
            </div>
          <div class="row justify-left q-gutter-md row items-start"> </div>

        </q-form>
        <div>
          <q-btn @click="setaId()" :disable="loading" label="adicionar" color="primary" to="/atividades"/>
          <q-btn @click="reset()" label="limpar" type="reset" color="primary" flat class="q-ml-sm" to="/atividades"/>
        </div>
      </div>
    </div>
    <div class="q-pa-md">
        <q-table
              title="Atividades cadastradas"
              :data="activities"
              :columns="columns"
              row-key="name"
              :loading="loading"
              binary-state-sort
        >
          <template v-slot:body="props">
            <q-tr :props="props">
              <q-td key="atividade" :props="props">
                {{ props.row.name }}
                <q-popup-edit v-model="props.row.name">
                  <q-input v-model="props.row.name" dense autofocus counter
                  />
                </q-popup-edit>
              </q-td>
              <q-td key="tipo" :props="props">
                {{ props.row.type.name }}
              </q-td>
              <q-td key="situacao" :props="props">
                {{ props.row.situation.name }}
              </q-td>
              <q-td key="descricao" :props="props">
                <div v-html=" props.row.description  "></div>
                <q-popup-edit v-model="props.row.description" title="Descrição" buttons label-set="Salvar" label-cancel= "Cancelar" @save="update"
                >
                  <q-editor type="textarea" v-model="props.row.description" min-height="10rem" autofocus @keyup.enter.stop @input="recebeLinha(props.row)"
                  />
                </q-popup-edit>
              </q-td>
              <q-btn flat  color="negative" icon="delete_forever" @click="recebeLinha(props.row)" @click.stop="removeRow()" to="/atividades"/>
            </q-tr>
          </template>
        </q-table>
      </div>

  </q-page>

</template>

<script>
export default {
  data () {
    return {
      loading: false,
      modelName: null,
      modelDescription: null,
      modelType: null,
      modelSituation: null,
      modelSaveJson: null,
      updateUuid: null,
      updateName: null,
      updateDescription: null,
      updateSituation: null,
      updateType: null,
      type: [],
      situation: [
        {
          uuid: []
        }
      ],
      columns: [
        { name: 'atividade', align: 'center', label: 'Atividades', field: row => row.name, sortable: true },
        { name: 'tipo', align: 'center', label: 'Tipos', field: row => row.name, sortable: true },
        { name: 'situacao', align: 'center', label: 'Situação', field: row => row.name, sortable: true },
        { name: 'descricao', align: 'center', label: 'Descrição', field: row => row.name, sortable: true }
      ],
      activities: []
    }
  },

  mounted () {
    this.buscarActivities()
    this.buscarTypes()
    this.buscaSituations()
  },

  methods: {
    gravar () {
      const cloned = JSON.parse(this.modelSaveJson)
      this.$axios.post('http://localhost:8083/activities', cloned)
      this.buscarActivities()
      this.loading = true
      this.loading = false
      this.refresh()
      this.refresh()
      console.log('--GRAVAR OK')
    },
    reset () {
      this.loading = true
      this.modelType = null
      this.modelSituation = null
      this.modelName = null
      this.modelDescription = null
      this.modelSaveJson = null
      this.updateUuid = null
      this.updateName = null
      this.updateDescription = null
      this.updateSituation = null
      this.updateType = null
      this.loading = false
      this.buscarActivities()
      console.log('RESET OK')
    },
    buscarTypes () {
      this.$axios.get('http://localhost:8083/type')
        .then((response) => {
          this.type = response.data
        })
        .catch((error) => {
          console.log(error.message)
        })
      console.log('BUSCAR TYPES OK')
    },
    buscaSituations () {
      this.$axios.get('http://localhost:8083/situation')
        .then((response) => {
          this.situation = response.data
        })
        .catch((error) => {
          console.log(error.message)
        })
      console.log('BUSCAR SITUATIONS OK')
    },
    buscarActivities () {
      this.$axios.get('http://localhost:8083/activities')
        .then((response) => {
          this.activities = response.data
        })
      this.loading = true
      this.activities = []
      this.loading = false
      console.log('BUSCAR ATIVIDADES OK')
    },
    setaId () {
      var recebeSituation = JSON.parse(JSON.stringify(this.modelSituation, ['uuid']), [0])
      var recebeType = JSON.parse(JSON.stringify(this.modelType, ['uuid']), [0])
      var situationJson = '"situation":' + JSON.stringify(recebeSituation) + ','
      var typeJson = '"type":' + JSON.stringify(recebeType) + '}'
      var nome = '{ "name":"' + this.modelName + '",'
      var descricao = '"description":"' + this.modelDescription + '",'
      var salvaJson = nome + descricao + situationJson + typeJson
      this.modelSaveJson = salvaJson
      console.log('SETAID OK')
      this.gravar()
    },
    update () {
      var nameJson = '{"name":' + JSON.stringify(this.updateName) + ','
      var descJson = '"description":' + JSON.stringify(this.updateDescription) + ','
      var sitJson = '"situation":{"uuid":' + JSON.stringify(this.updateSituation) + '},'
      var typeJson = '"type":{"uuid":' + JSON.stringify(this.updateType) + '}}'
      var completeJson = nameJson + descJson + sitJson + typeJson
      this.$axios.put('http://localhost:8083/activities/' + this.updateUuid, JSON.parse(completeJson))
      console.log('--UPDATE OK')
      this.reset()
    },
    recebeLinha (itens) {
      var recebeJson = JSON.parse(JSON.stringify(itens))
      this.updateUuid = recebeJson.uuid
      this.updateName = recebeJson.name
      this.updateDescription = recebeJson.description
      this.updateSituation = recebeJson.situation.uuid
      this.updateType = recebeJson.type.uuid
      console.log('RECEBE LINHA OK')
    },
    refresh () {
      this.buscarActivities()
      this.reset()
      this.buscarTypes()
      this.buscaSituations()
      console.log('REFRESH OK')
    },
    removeRow () {
      var recebeUuid = this.updateUuid
      console.log('ID LINHA REMOVIDA: ' + this.updateUuid)
      this.$axios.delete('http://localhost:8083/activities/' + recebeUuid)
      console.log('--REMOVE ROW OK')
      this.buscarActivities()
      this.refresh()
    }
  }

}
</script>

<style>

</style>
