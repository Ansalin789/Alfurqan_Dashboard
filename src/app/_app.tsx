import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { DarkModeProvider } from '@/components/DarkMode/DarkModeContext'
import { useEffect } from 'react'

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    const ratio = window.devicePixelRatio
    document.body.dataset.dpi = ratio.toString()
  }, [])

  return (
    <DarkModeProvider>
      <Component {...pageProps} />
    </DarkModeProvider>
  )
}
