import React, { useEffect, useState } from 'react'
import type { NextPage } from 'next'
import useSWR from 'swr'

import Spinner from 'react-bootstrap/Spinner'

import Navigation from 'components/Navigation'
import Select from 'components/Select'
import Table from 'components/Table'

import { fetcher } from 'lib/utils'

const Content = ({ scientificField }) => {
  const fetchUrl = scientificField ? `/api/queries/3.3?id=${scientificField}`:null
  const { data, error } = useSWR(fetchUrl, fetcher, {revalidateOnFocus: false, revalidateOnReconnect: false})

  if (!scientificField) return <Spinner style={{ margin: 'auto' }} animation="grow" />

  if (error) return <div>failed to load: {error?.info?.err}</div>
  if (!data) return <Spinner style={{ margin: 'auto' }} animation="grow" />

  return <Table rows={data.rows}/>
}

const QueryPage: NextPage = () => {
  const [scientificField, setScientificField] = useState()

  const fetchUrl = `/api/entities/scientific_field`
  const { data, error } = useSWR(fetchUrl, fetcher, {revalidateOnFocus: false, revalidateOnReconnect: false})

  if (error) return <div>failed to load: {error?.info?.err}</div>
  if (!data) return <Spinner style={{ margin: 'auto' }} animation="grow" />

  const handleSelect = (_, value) => {
    setScientificField(value?.id)
  }

  const formattedSelectData = data.rows.map(sf => ({
    id: sf.id,
    label: sf.field_name
  }))

  return (
    <>
      <Navigation />
      <div style={{margin: '10px 15px', display: 'flex'}}>
        <div style={{flexGrow: 2, flexBasis: 0}}>
          <h1>3.3</h1>
          <span>Projects funded in the specific scientific field and researchers working on each project</span>
        </div>
        <div style={{flexGrow: 1, flexBasis: 0, display: 'flex', alignItems: 'center'}}>
          <Select title='Scientific Field' data={formattedSelectData} handleSelect={handleSelect}/>
        </div>
      </div>
      <div style={{width: '100%', height: '100%', flexGrow: 1, minHeight: '500px', display: 'flex', flexDirection: 'column'}}>
        {scientificField && <Content scientificField={scientificField}/>}
      </div>
    </>
  )
}

export default QueryPage
