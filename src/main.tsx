import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

/* Color de la barra del navegador (arriba en iPhone/Android).
   Se fuerza siempre al tono del header/footer (#d2dbeb) para que las franjas
   que quedan arriba del header y abajo del footer se vean iguales que ellos.
   Safari 26 ignora este meta, pero el color también está en html/body y en los
   elementos fijos, que es de donde Safari toma el tinte. */
const THEME_COLOR = '#d2dbeb'
const themeMeta = document.querySelector('meta[name="theme-color"]')
if (themeMeta) {
  themeMeta.setAttribute('content', THEME_COLOR)
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
