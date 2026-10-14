<template>
  <ion-page>
    <ion-header><ion-toolbar>
      <ion-buttons slot="start"><ion-back-button default-href="/login" /></ion-buttons>
      <ion-title>Recuperar senha</ion-title>
    </ion-toolbar></ion-header>
    <ion-content class="ion-padding">
      <p>Digite seu e-mail. Vamos enviar um link para você criar uma nova senha.</p>
      <ion-input v-model="email" type="email" label="E-mail" label-placement="floating" fill="outline" />
      <ion-button expand="block" class="ion-margin-top" :disabled="carregando" @click="enviar">Enviar link</ion-button>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonInput, IonButton, IonButtons, IonBackButton } from '@ionic/vue'
import { supabase } from '@/lib/supabase'
import { avisar } from '@/lib/avisar'

const email = ref('')
const carregando = ref(false)

async function enviar() {
  carregando.value = true
  const { error } = await supabase.auth.resetPasswordForEmail(email.value, {
    redirectTo: `${window.location.origin}/redefinir-senha`,
  })
  carregando.value = false
  if (error) return avisar(error.message, 'danger')
  avisar('Se o e-mail estiver cadastrado, o link foi enviado.')
}
</script>