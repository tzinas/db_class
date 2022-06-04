import React, { useEffect, useState } from 'react'
import type { NextPage } from 'next'
import useSWR from 'swr'

import Spinner from 'react-bootstrap/Spinner'
import Tab from 'react-bootstrap/Tab'
import Tabs from 'react-bootstrap/Tabs'

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

const View = () => {
  return (
    <></>
  )
}

const QueryPage: NextPage = () => {
  const [tab, setTab] = useState(1)

  const fetchUrl = `/api/queries`
  //const { data, error } = useSWR(fetchUrl, fetcher)

  //if (error) return <div>failed to load: {error?.info?.err}</div>
  //if (!data) return <Spinner style={{ margin: 'auto' }} animation="grow" />

  const handleSelect = (e) => {
    setTab(e)
  }

  return (
    <>
      <Navigation />
      <div style={{margin: '10px 15px'}}>
          <h1>3.2</h1>
          {tab == 1 && <span>Projects per researcher</span>}
          {tab == 2 && <span>Number of projects per research center</span>}
        </div>
      <div style={{width: '100%', height: '100%', flexGrow: 1, minHeight: '500px', display: 'flex', flexDirection: 'column'}}>
        <Tabs defaultActiveKey={1} style={{marginTop: '20px'}} onSelect={handleSelect} id="uncontrolled-tab-example" className="mb-3">
          <Tab eventKey={1} title="View 1">
          </Tab>
          <Tab eventKey={2} title="View 2">
          </Tab>
        </Tabs>
      </div>
    </>
  )
}

export default QueryPage
