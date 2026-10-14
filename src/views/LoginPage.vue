<template>
  <ion-page>
    <ion-header><ion-toolbar><ion-title>Entrar</ion-title></ion-toolbar></ion-header>
    <ion-content class="ion-padding">
      <ion-input v-model="email" type="email" label="E-mail" label-placement="floating" fill="outline" />
      <ion-input v-model="senha" type="password" label="Senha" label-placement="floating" fill="outline" class="ion-margin-top" />
      <ion-button expand="block" class="ion-margin-top" :disabled="carregando" @click="entrar">Entrar</ion-button>
      <ion-button expand="block" fill="clear" router-link="/recuperar-senha">Esqueci minha senha</ion-button>
      <ion-button expand="block" fill="clear" router-link="/cadastro">Criar conta</ion-button>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonInput, IonButton } from '@ionic/vue'
import { supabase } from '@/lib/supabase'
import { avisar } from '@/lib/avisar'

const router = useRouter()
const email = ref('')
const senha = ref('')
const carregando = ref(false)

async function entrar() {
  carregando.value = true
  const { error } = await supabase.auth.signInWithPassword({ email: email.value, password: senha.value })
  carregando.value = false
  if (error) return avisar('E-mail ou senha incorretos', 'danger')
  router.replace('/boas-vindas')
}
</script>