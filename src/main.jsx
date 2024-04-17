import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { MantineProvider } from '@mantine/core'
import { CharacterCustomizationProvider } from './components/Configurator/CharacterCustomization'
import { SocketclientProvider } from './components/Login/SocketClient'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { VideoChatProvider } from './components/voiceContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId='752697870137-5qj8rovsismcm5816jkr7t16jacgj31n.apps.googleusercontent.com'>
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
      >
        <SocketclientProvider>
          <VideoChatProvider>
            <CharacterCustomizationProvider>
              <App />
            </CharacterCustomizationProvider>
          </VideoChatProvider>
        </SocketclientProvider>
      </MantineProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
)
