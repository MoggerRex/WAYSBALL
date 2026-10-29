import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

/* Color de la barra del navegador (arriba en iPhone/Android).
   En móvil debe ser el mismo tono que el header y el footer (#d2dbeb);
   en pantallas grandes se usa el azul oscuro del marco del mockup.
   Se hace por JS porque iOS Safari ignora el atributo media del meta. */
const THEME_MOBILE = '#d2dbeb'
const THEME_DESKTOP = '#001c2d'
const themeMeta = document.querySelector('meta[name="theme-color"]')
if (themeMeta) {
  const wideScreen = window.matchMedia('(min-width: 720px)')
  const syncThemeColor = () => {
    themeMeta.setAttribute('content', wideScreen.matches ? THEME_DESKTOP : THEME_MOBILE)
  }
  syncThemeColor()
  wideScreen.addEventListener('change', syncThemeColor)
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
