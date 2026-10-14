import { toastController } from '@ionic/vue'

export async function avisar(mensagem: string, cor = 'success') {
  const toast = await toastController.create({ message: mensagem, duration: 2500, color: cor, position: 'top' })
  await toast.present()
}