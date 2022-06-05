import React, { useEffect, useState } from 'react'
import type { NextPage } from 'next'
import useSWR from 'swr'
import dateFormat from "dateformat"

import Spinner from 'react-bootstrap/Spinner'
import Form from 'react-bootstrap/Form'
import FloatingLabel from 'react-bootstrap/FloatingLabel'
import Modal from 'react-bootstrap/Modal'

import Navigation from 'components/Navigation'
import DateRangePicker from 'components/DateRange'
import Table from 'components/Table'
import Select from 'components/Select'

import styles from 'styles/modal.module.scss'

import { fetcher } from 'lib/utils'

const Researchers = ({ projectId, setShowWithId }) => {
  const fetchUrl = projectId ? `/api/queries/3.1?projectId=${projectId}`:''
  const { data, error } = useSWR(fetchUrl, fetcher)

  return (
    <Modal
        show={projectId ? true:false}
        onHide={() => setShowWithId(null)}
        dialogClassName={styles.dialog}
        contentClassName={styles.content}
        aria-labelledby="example-custom-modal-styling-title"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-custom-modal-styling-title">
            Researchers
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error &&
            <div>failed to load: {error?.info?.err}</div>
          }
          {!data &&
            <Spinner style={{ margin: 'auto' }} animation="grow" />
          }
          <Table rows={data.rows}/>
        </Modal.Body>
      </Modal>
  )
}

const Content = ({ executive, duration, fromDate, toDate }) => {
  const [showWithId, setShowWithId] = useState()

  const baseUrl = `/api/queries/3.1`
  let Urlparameters = ''

  let firstAtr = true
  Object.entries({executive, duration, fromDate: fromDate ? dateFormat(fromDate, "yyyy-mm-dd"):null, toDate: toDate ? dateFormat(toDate, "yyyy-mm-dd"):null}).forEach(([key,value]) => {
    if (!value) {
      return
    }

    Urlparameters += `${!firstAtr ? '&':''}${key}=${value}`
    firstAtr = false
  })

  const fetchUrl = Urlparameters === "" ? baseUrl:`${baseUrl}?${Urlparameters}`
  
  const { data, error } = useSWR(fetchUrl, fetcher)

  if (error) return <div>failed to load: {error?.info?.err}</div>
  if (!data) return <Spinner style={{ margin: 'auto' }} animation="grow" />

  const handleSelect = (id) => {
    setShowWithId(id)
  }

  return (
    <>
      <Table rows={data.rows} hidden={['id']} handleClick={handleSelect}/>
      <Researchers projectId={showWithId} setShowWithId={setShowWithId}/>
    </>
  )
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

  const handleChangeDuration = (event) => {
    const num = Number(event.target.value)
    if (Number.isInteger(num) && num >= 0) {
      setDuration(event.target.value)
    }
  }

  const formattedExecutives = data.rows.map(ex => ({
    id: ex.id,
    label: `${ex.first_name} ${ex.last_name}`
  }))

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
          <div style={{marginTop: '10px'}}>
            <DateRangePicker fromDate={fromDate} setFromDate={setFromDate} toDate={toDate} setToDate={setToDate} />
          </div>
          <div style={{display: 'flex', marginTop: '15px'}}>
            <FloatingLabel
              controlId="floatingInput"
              label="Duration (years)"
            >
              <Form.Control value={duration ? duration:""} onChange={handleChangeDuration} type="number" placeholder=""/>
            </FloatingLabel>
            <div style={{marginLeft: '15px', flexGrow: 1}}>
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
