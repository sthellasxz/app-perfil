<template>
  <ion-page>
    <ion-header><ion-toolbar><ion-title>Nova senha</ion-title></ion-toolbar></ion-header>
    <ion-content class="ion-padding">
      <ion-input v-model="senha" type="password" label="Nova senha" label-placement="floating" fill="outline" />
      <ion-input v-model="confirmacao" type="password" label="Confirme a senha" label-placement="floating" fill="outline" class="ion-margin-top" />
      <ion-button expand="block" class="ion-margin-top" :disabled="carregando" @click="salvar">Salvar nova senha</ion-button>
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
const senha = ref('')
const confirmacao = ref('')
const carregando = ref(false)

async function salvar() {
  if (senha.value !== confirmacao.value) return avisar('As senhas não conferem', 'danger')
  carregando.value = true
  const { error } = await supabase.auth.updateUser({ password: senha.value })
  carregando.value = false
  if (error) return avisar(error.message, 'danger')
  avisar('Senha alterada!')
  router.replace('/boas-vindas')
}
</script>