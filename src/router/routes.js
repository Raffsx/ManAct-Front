
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') },
      { path: 'atividades', component: () => import('pages/atividades/PAtividades.vue') },

      { path: 'tipos', component: () => import('pages/Tipos/PTipos.vue') },

      { path: 'situacoes', component: () => import('pages/Situacoes/PSituacoes.vue') }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
