import React from 'react'
import '../styles/globals.scss'
import { AuthProvider } from "../lib/authContext"

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  )
}

export default MyApp
