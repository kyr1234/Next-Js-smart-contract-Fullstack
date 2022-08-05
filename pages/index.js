import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { useMoralis } from 'react-moralis'
import Header from '../Components/Header'

export default function Home() {
  return (
    <>
      <div>
        <Header />
      </div>
      <div className={styles.container}>Hi !</div>
    </>
  )
}
