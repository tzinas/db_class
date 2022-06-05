import React from 'react'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import Error from 'next/error'
import useSWR from 'swr'

import Spinner from 'react-bootstrap/Spinner'

import Navigation from 'components/Navigation'
import Table from 'components/Table'

import { fetcher } from 'lib/utils'

const availableQueries: string[] = [
  '3.4',
  '3.5',
  '3.6',
  '3.7',
  '3.8'
]

const QueryPage: NextPage = () => {
  const router = useRouter()
  const { query }: { query?: string } = router.query

  const fetchUrl = query ? `/api/queries/${query}`:null
  const { data, error } = useSWR(fetchUrl, fetcher, {revalidateOnFocus: false, revalidateOnReconnect: false})

  if (!query) return <Spinner style={{ margin: 'auto' }} animation="grow" />

  if (!availableQueries.includes(query)) {
    return <Error statusCode={404}></Error>
  }

  if (error) return <div>failed to load: {error?.info?.err}</div>
  if (!data) return <Spinner style={{ margin: 'auto' }} animation="grow" />

  return (
    <>
      <Navigation />
      <div style={{width: '100%', height: '100%', flexGrow: 1, minHeight: '500px', display: 'flex', flexDirection: 'column'}}>
        <div style={{margin: '10px 15px'}}>
          <h1>{data.title}</h1>
          <span>{data.description}</span>
        </div>
        <Table rows={data.rows}/>
      </div>
    </>
  )
}

export default QueryPage
