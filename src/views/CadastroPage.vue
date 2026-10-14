<template>
  <ion-page>
    <ion-header><ion-toolbar>
      <ion-buttons slot="start"><ion-back-button default-href="/login" /></ion-buttons>
      <ion-title>Criar conta</ion-title>
    </ion-toolbar></ion-header>
    <ion-content class="ion-padding">
      <ion-input v-model="email" type="email" label="E-mail" label-placement="floating" fill="outline" />
      <ion-input v-model="senha" type="password" label="Senha (mín. 6 caracteres)" label-placement="floating" fill="outline" class="ion-margin-top" />
      <ion-button expand="block" class="ion-margin-top" :disabled="carregando" @click="cadastrar">Cadastrar</ion-button>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonInput, IonButton, IonButtons, IonBackButton } from '@ionic/vue'
import { supabase } from '@/lib/supabase'
import { avisar } from '@/lib/avisar'

const router = useRouter()
const email = ref('')
const senha = ref('')
const carregando = ref(false)

async function cadastrar() {
  carregando.value = true
  const { data, error } = await supabase.auth.signUp({ email: email.value, password: senha.value })
  carregando.value = false
  if (error) return avisar(error.message, 'danger')
  if (data.session) {
    router.replace('/perfil')                       // confirmação de e-mail desligada
  } else {
    avisar('Conta criada! Confirme pelo link enviado ao seu e-mail.')
    router.replace('/login')
  }
}
</script>