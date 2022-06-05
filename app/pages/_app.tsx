import Head from "next/head"
import 'styles/styles.scss'

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>DB-CLASS NTUA ECE 2022</title>
        <meta name="description" content="Application for db-class 2022" />
      </Head>
      <Component {...pageProps} />
    </>
  )
}
