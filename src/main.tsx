//import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import {TonConnectUIProvider} from "@tonconnect/ui-react"
import App from './App.tsx'
import './index.css'

const manifestUrl = "https://ishisan.github.io/dapp/tonconnect-manifest.json";
createRoot(document.getElementById('root')!).render(
    <TonConnectUIProvider manifestUrl={manifestUrl}>
        <App/>
    </TonConnectUIProvider>,
)
