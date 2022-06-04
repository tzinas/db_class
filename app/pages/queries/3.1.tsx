import React, { useEffect, useState } from 'react'
import type { NextPage } from 'next'
import useSWR from 'swr'
import dateFormat from "dateformat"

import Spinner from 'react-bootstrap/Spinner'
import Form from 'react-bootstrap/Form'
import FloatingLabel from 'react-bootstrap/FloatingLabel'

import Navigation from 'components/Navigation'
import DateRangePicker from 'components/DateRange'
import Table from 'components/Table'
import Select from 'components/Select'

import { fetcher } from 'lib/utils'

const Content = ({ executive, duration, fromDate, toDate }) => {
  const baseUrl = `/api/queries/3.1`
  let Urlparameters = ''

  Object.entries({executive, duration, fromDate: fromDate ? dateFormat(fromDate, "yyyy-mm-dd"):null, toDate: toDate ? dateFormat(toDate, "yyyy-mm-dd"):null}).forEach(([key,value]) => {
    Urlparameters += value ? `${key}=${value}`:""
  })

  const fetchUrl = Urlparameters === "" ? baseUrl:`${baseUrl}?${Urlparameters}`
  console.log(fetchUrl)
  
  /*
  const { data, error } = useSWR(fetchUrl, fetcher)

  if (!scientificField) return <Spinner style={{ margin: 'auto' }} animation="grow" />

  if (error) return <div>failed to load: {error?.info?.err}</div>
  if (!data) return <Spinner style={{ margin: 'auto' }} animation="grow" />
  */
  return <></>
  return <Table rows={data.rows}/>
}

const QueryPage: NextPage = () => {
  const [executive, setExecutive] = useState<string | null>()
  const [duration, setDuration] = useState<string | null>()
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);

  const fetchUrl = `/api/entities/executive`
  const { data, error } = useSWR(fetchUrl, fetcher)

  if (error) return <div>failed to load: {error?.info?.err}</div>
  if (!data) return <Spinner style={{ margin: 'auto' }} animation="grow" />

  const handleSelect = (_, value) => {
    setExecutive(value?.id)
  }

  const formattedExecutives = data.rows.map(ex => ({
    id: ex.id,
    label: `${ex.first_name} ${ex.last_name}`
  }))

  console.log(fromDate, toDate)
  return (
    <>
      <Navigation />
      <div style={{margin: '10px 15px', display: 'flex'}}>
        <div style={{flexGrow: 1, flexBasis: 0}}>
          <h1>3.1</h1>
          <span>Available programs and projects that satisfy given criteria</span>
          <span>Choose project to see the researchers that work on it</span>
        </div>
        <div style={{flexGrow: 2, flexBasis: 0, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <div>
            <DateRangePicker fromDate={fromDate} setFromDate={setFromDate} toDate={toDate} setToDate={setToDate} />
          </div>
          <div style={{display: 'flex', marginTop: '30px'}}>
            <FloatingLabel
              controlId="floatingInput"
              label="Duration (years)"
            >
              <Form.Control value={duration ? duration:""} onChange={(e) => setDuration(e.target.value)} type="number" />
            </FloatingLabel>
            <div style={{marginLeft: '30px', flexGrow: 1}}>
              <Select title='Executives' data={formattedExecutives} handleSelect={handleSelect} />
            </div>
          </div>
        </div>
      </div>
      <div style={{width: '100%', height: '100%', flexGrow: 1, minHeight: '500px', display: 'flex', flexDirection: 'column'}}>
        <Content executive={executive} duration={duration} fromDate={fromDate} toDate={toDate}/>
      </div>
    </>
  )
}

export default QueryPage
