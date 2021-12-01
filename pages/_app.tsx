import '../styles/globals.css'
import 'cropperjs/dist/cropper.css'
import type { AppProps } from 'next/app'
import NavBar from '../components/navbar'
import Footer from '../components/footer'

import {Provider, signIn, useSession} from 'next-auth/client'
import { AuthedPageProps } from '../types/AuthedPage'
import { NextComponentType } from 'next'
import { ReactNode, useEffect, FC, JSXElementConstructor } from 'react'


const Auth: FC = ({children}) => { // checks if user is logged in and redirects to login page if not
  const [session, loading] = useSession()
  const isUser = !!session?.user
  useEffect(() => {
    if (loading) return ;
    if(!isUser) {
      signIn()
    }
  }, [isUser, loading])
  if(isUser) {
    return <>{children}</>
  }

  return <div>Loading...</div>
}

function MyApp({ Component, pageProps }: AuthedPageProps) {
  return (
    <Provider session={pageProps.session}>
      <div className="flex flex-col min-h-screen">
        <NavBar />
        {Component.needsAuth ? (
          <Auth>
            <div className="flex-1">
              <Component {...pageProps} />
            </div>
          </Auth>
        ) : (
          <div className="flex-1">
            <Component {...pageProps} />
          </div>

        )}
        <Footer />

      </div>
    </Provider>
  )
}

export default MyApp
