<template>
  <ion-page>
    <ion-header><ion-toolbar>
      <ion-buttons slot="start"><ion-back-button default-href="/boas-vindas" /></ion-buttons>
      <ion-title>Meu perfil</ion-title>
    </ion-toolbar></ion-header>
    <ion-content class="ion-padding">
      <div class="ion-text-center">
        <ion-avatar style="width:120px;height:120px;margin:16px auto">
          <img :src="avatarUrl || 'https://ionicframework.com/docs/img/demos/avatar.svg'" alt="Foto de perfil" />
        </ion-avatar>
        <ion-button size="small" fill="outline" :disabled="enviandoFoto" @click="trocarFoto">
          {{ enviandoFoto ? 'Enviando...' : 'Trocar foto' }}
        </ion-button>
      </div>

      <ion-input v-model="nome" label="Nome completo" label-placement="floating" fill="outline" class="ion-margin-top" />
      <ion-input v-model="nickname" label="Nickname" label-placement="floating" fill="outline" class="ion-margin-top" />
      <ion-input v-model="dataNascimento" type="date" label="Data de nascimento" label-placement="stacked" fill="outline" class="ion-margin-top" />

      <ion-button expand="block" class="ion-margin-top" :disabled="salvando" @click="salvar">Salvar</ion-button>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonInput, IonButton, IonButtons, IonBackButton, IonAvatar, onIonViewWillEnter } from '@ionic/vue'
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera'
import { supabase } from '@/lib/supabase'
import { avisar } from '@/lib/avisar'

const router = useRouter()
const userId = ref('')
const nome = ref('')
const nickname = ref('')
const dataNascimento = ref('')
const avatarUrl = ref('')
const salvando = ref(false)
const enviandoFoto = ref(false)

// carrega o perfil (Database)
onIonViewWillEnter(async () => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return
  userId.value = user.id
  const { data } = await supabase.from('perfis').select('*').eq('id', user.id).maybeSingle()
  if (data) {
    nome.value = data.nome ?? ''
    nickname.value = data.nickname ?? ''
    dataNascimento.value = data.data_nascimento ?? ''
    avatarUrl.value = data.avatar_url ?? ''
  }
})

// tira ou escolhe a foto e envia (Capacitor + Storage)
async function trocarFoto() {
  try {
    const foto = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Prompt,   // pergunta: câmera ou galeria
      quality: 80,
      width: 512,
    })
    enviandoFoto.value = true
    const arquivo = await (await fetch(foto.webPath!)).blob()
    const caminho = `${userId.value}/avatar.${foto.format}`

    const { error } = await supabase.storage.from('avatars')
      .upload(caminho, arquivo, { upsert: true, contentType: `image/${foto.format}` })
    if (error) throw error

    const { data } = supabase.storage.from('avatars').getPublicUrl(caminho)
    avatarUrl.value = `${data.publicUrl}?t=${Date.now()}`   // ?t= evita mostrar a foto antiga do cache
    avisar('Foto enviada! Clique em Salvar para confirmar.')
  } catch (e: any) {
    if (!String(e?.message).toLowerCase().includes('cancel')) avisar('Não foi possível enviar a foto', 'danger')
  } finally {
    enviandoFoto.value = false
  }
}

// grava os dados (Database)
async function salvar() {
  salvando.value = true
  const { error } = await supabase.from('perfis').upsert({
    id: userId.value,
    nome: nome.value,
    nickname: nickname.value || null,
    data_nascimento: dataNascimento.value || null,
    avatar_url: avatarUrl.value || null,
    atualizado_em: new Date().toISOString(),
  })
  salvando.value = false
  if (error) {
    if (error.code === '23505') return avisar('Esse nickname já está em uso', 'danger')
    return avisar(error.message, 'danger')
  }
  avisar('Perfil salvo!')
  router.replace('/boas-vindas')
}
</script>