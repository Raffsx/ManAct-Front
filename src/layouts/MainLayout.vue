<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />

        <q-toolbar-title>
          Quasar App
        </q-toolbar-title>

        <div>Quasar v{{ $q.version }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      content-class="bg-grey-1"
    >
      <q-list>
        <q-item-label
          header
          class="text-grey-8"
        >
          Menu
        </q-item-label>
        <MenuLink
          v-for="link in menuItems"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import MenuLink from 'components/MenuLink.vue'

export default {
  name: 'MainLayout',
  components: { MenuLink },
  data () {
    return {
      leftDrawerOpen: false,
      menuItems: [
        {
          title: 'Atividades',
          caption: 'Cadastrar/Listar Atividades',
          icon: 'local_activity',
          link: '/atividades'
        },
        {
          title: 'Tipos',
          caption: 'Cadastrar/Listar Tipos',
          icon: 'folder',
          link: '/tipos'
        },
        {
          title: 'Situações',
          caption: 'Cadastrar/Listar Situações',
          icon: 'transform',
          link: '/situacoes'
        }
      ]
    }
  }
}
</script>
