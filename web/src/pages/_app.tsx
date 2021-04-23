import {AppProps } from 'next/app';
import '../styles/global.scss';

import { Header } from '../components/Header';
import {Player} from '../components/Player';
import {PlayerContextProvider} from '../hooks/usePlayer';

import styles from '../styles/app.module.scss';



function MyApp({ Component, pageProps }: AppProps) {
  return (
   <PlayerContextProvider>
      <div className={styles.appWrapper}>
      <main>
        <Header/>
        <Component {...pageProps} />
      </main>
      <Player/>
    </div>
   </PlayerContextProvider>
  )
}

export default MyApp;