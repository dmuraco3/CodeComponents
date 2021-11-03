import '../styles/globals.css'
import type { AppProps } from 'next/app'
import NavBar from '../components/navbar'

import {Provider} from 'next-auth/client'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider session={pageProps.session}>
      <NavBar />
      <Component {...pageProps} />
    </Provider>
  )
}

export default MyApp
