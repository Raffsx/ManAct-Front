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
              option-value="uuid"
              option-label="name"
              label="Situação *"
              />
            </div>
          <div class="row justify-left q-gutter-md row items-start"> </div>

        </q-form>
        <div>
          <q-btn @click="setaId()" label="adicionar" color="primary" to="/atividades"/>
          <q-btn @click="reset()" label="limpar" type="reset" color="primary" flat class="q-ml-sm" />
        </div>
      </div>
    </div>
    <template>
  <div class="q-pa-md">
      <q-table
            title="Treats"
            :data="activities"
            :columns="columns"
            row-key="name"
            binary-state-sort
      >
            <template v-slot:body="props">
              <q-tr :props="props">
                <q-td key="atividade" :props="props">
                  {{ props.row.name }}
                  <q-popup-edit v-model="props.row.name">
                    <q-input v-model="props.row.name" dense autofocus counter />
                  </q-popup-edit>
                </q-td>
                <q-td key="tipo" :props="props">
                  {{ props.row.type.name }}
                  <q-popup-edit v-model="props.row.type.name" title="Tipo" buttons>
                    <q-input type="textarea" v-model="props.row.type.name" dense autofocus />
                  </q-popup-edit>
                </q-td>
                <q-td key="situacao" :props="props">
                  {{ props.row.situation.name }}
                  <q-popup-edit v-model="props.row.situation.name" title="Situação" buttons>
                    <q-input type="textarea" v-model="props.row.situation.name" dense autofocus />
                  </q-popup-edit>
                </q-td>
                <q-td key="descricao" :props="props">
                  {{ props.row.description }}
                  <q-popup-edit v-model="props.row.description" title="Descrição" buttons>
                    <q-input type="textarea" v-model="props.row.description" dense autofocus />
                  </q-popup-edit>
                </q-td>
                <q-td key="colAtividades" :props="props">{{ props.row.atividade }}</q-td>
                <q-td key="colTipos" :props="props">{{ props.row.tipo }}</q-td>
                <q-td key="colSituacoes" :props="props">{{ props.row.situacao }}</q-td>
                <q-td key="colDescricoes" :props="props">{{ props.row.description }}</q-td>
              </q-tr>
            </template>
      </q-table>
   </div>
  </template>
  </q-page>
</template>

<script>
export default {
  data () {
    return {
      modelName: null,
      modelDescription: null,
      modelType: null,
      modelSituation: null,
      modelSaveJson: null,
      type: [],
      situation: [
        {
          uuid: []
        }
      ],
      columns: [
        {
          name: 'atividade',
          required: true,
          label: 'Atividade',
          align: 'left',
          field: row => row.name,
          format: val => `${val}`,
          sortable: true
        },
        { name: 'tipo', align: 'center', label: 'Tipos', field: 'type', sortable: true },
        { name: 'situacao', align: 'center', label: 'Situação', field: 'situation', sortable: true },
        { name: 'descricao', align: 'center', label: 'Descrição', field: 'description', sortable: true }
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
      console.log(cloned)
      console.log(this.modelType)
      console.log(this.modelSituation)
      this.$axios.post('http://localhost:8083/activities', cloned)
        .then(function (response) {
          this.$q.notify({
            color: 'red-5',
            textColor: 'white',
            icon: 'success',
            message: 'Atividade salva com sucesso'
          })
          console.log('salvou atividade')
        })
        .catch(function (error) {
          console.log(error)
        })
      this.reset()
    },

    reset () {
      this.modelType = null
      this.modelSituation = null
      this.modelName = null
      this.modelDescription = null
    },
    buscarTypes () {
      this.$axios.get('http://localhost:8083/type')
        .then((response) => {
          this.type = response.data
        })
        .catch((error) => {
          console.log(error.message)
        })
    },
    buscaSituations () {
      this.$axios.get('http://localhost:8083/situation')
        .then((response) => {
          this.situation = response.data
        })
        .catch((error) => {
          console.log(error.message)
        })
    },
    buscarActivities () {
      this.$axios.get('http://localhost:8083/activities')
        .then((response) => {
          this.activities = response.data
        })
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
      console.log(salvaJson)
      this.gravar()
    }
  }

}
</script>
