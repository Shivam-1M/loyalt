import '@/styles/globals.css'
import { MeshProvider } from '@meshsdk/react'
import type { AppProps } from 'next/app'
import { useEffect } from 'react'
import { UserPointsProvider } from '../components/userPointsContext';

function App({ Component, pageProps }: AppProps) {
  
  useEffect(()=> {
    require("bootstrap/dist/js/bootstrap.bundle.min.js")
  }, []);

  return (
    <UserPointsProvider>
      <MeshProvider>
        <Component {...pageProps} />
      </MeshProvider>
    </UserPointsProvider>
    )
}
export default App;

