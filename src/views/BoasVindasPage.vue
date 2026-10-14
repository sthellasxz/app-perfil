<template>
  <ion-page>
    <ion-header><ion-toolbar><ion-title>Início</ion-title></ion-toolbar></ion-header>
    <ion-content class="ion-padding ion-text-center">
      <ion-avatar style="width:120px;height:120px;margin:32px auto 16px">
        <img :src="perfil?.avatar_url || 'https://ionicframework.com/docs/img/demos/avatar.svg'" alt="Foto de perfil" />
      </ion-avatar>
      <h1>Olá, {{ perfil?.nickname || perfil?.nome || email }}! 👋</h1>
      <p v-if="!perfil">Seu perfil ainda está vazio. Que tal completá-lo?</p>
      <p v-else>Que bom ter você de volta.</p>
      <ion-button expand="block" router-link="/perfil">Editar perfil</ion-button>
      <ion-button expand="block" fill="outline" color="medium" @click="sair">Sair</ion-button>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonAvatar, onIonViewWillEnter } from '@ionic/vue'
import { supabase } from '@/lib/supabase'

const router = useRouter()
const email = ref('')
const perfil = ref<{ nome: string; nickname: string; avatar_url: string } | null>(null)

// roda toda vez que a tela aparece (inclusive ao voltar do perfil)
onIonViewWillEnter(async () => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return
  email.value = user.email ?? ''
  const { data } = await supabase.from('perfis').select('nome, nickname, avatar_url').eq('id', user.id).maybeSingle()
  perfil.value = data
})

async function sair() {
  await supabase.auth.signOut()
  router.replace('/login')
}
</script>