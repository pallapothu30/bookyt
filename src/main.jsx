import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {FirebaseProvider} from "./context/Firebase.jsx"
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <FirebaseProvider>
        <App />
      </FirebaseProvider>
    </BrowserRouter>
  </StrictMode>,
)
