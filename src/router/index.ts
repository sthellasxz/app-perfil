import { createRouter, createWebHistory } from '@ionic/vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { supabase } from '@/lib/supabase'

const routes: RouteRecordRaw[] = [
  { path: '/', redirect: '/boas-vindas' },
  { path: '/login', component: () => import('@/views/LoginPage.vue') },
  { path: '/cadastro', component: () => import('@/views/CadastroPage.vue') },
  { path: '/recuperar-senha', component: () => import('@/views/RecuperarSenhaPage.vue') },
  { path: '/redefinir-senha', component: () => import('@/views/RedefinirSenhaPage.vue') },
  { path: '/boas-vindas', component: () => import('@/views/BoasVindasPage.vue'), meta: { requerLogin: true } },
  { path: '/perfil', component: () => import('@/views/PerfilPage.vue'), meta: { requerLogin: true } },
]

const router = createRouter({ history: createWebHistory(import.meta.env.BASE_URL), routes })

// Guarda de rota: quem não está logado vai para o login
router.beforeEach(async (to) => {
  const { data: { session } } = await supabase.auth.getSession()
  if (to.meta.requerLogin && !session) return '/login'
  if ((to.path === '/login' || to.path === '/cadastro') && session) return '/boas-vindas'
})

export default router