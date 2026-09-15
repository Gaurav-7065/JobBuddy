import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "./style.css"
import App from './App.jsx'
import { AuthProvider } from './features/auth/auth.context.jsx'

createRoot(document.getElementById('root')).render(

    
       <App />
   
    

)
