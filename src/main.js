import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

// Dinamik Yuvarlak Favicon Oluşturucu
const createCircularFavicon = () => {
  const img = new Image()
  img.src = '/assets/pp.png'
  img.onload = () => {
    const canvas = document.createElement('canvas')
    canvas.width = 64
    canvas.height = 64
    const ctx = canvas.getContext('2d')

    // Daire çiz ve içine resmi yerleştir
    ctx.beginPath()
    ctx.arc(32, 32, 32, 0, Math.PI * 2)
    ctx.closePath()
    ctx.clip()
    ctx.drawImage(img, 0, 0, 64, 64)

    // Favicon linkini güncelle
    let link = document.querySelector("link[rel~='icon']")
    if (!link) {
      link = document.createElement('link')
      link.rel = 'icon'
      document.head.appendChild(link)
    }
    link.href = canvas.toDataURL('image/png')
  }
}

createCircularFavicon()
createApp(App).mount('#app')
