import { useState } from 'react'
import useSWR from 'swr'
import _ from 'lodash'

import TableContainer from '@mui/material/TableContainer'
import MUITable from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableBody from "@mui/material/TableBody"
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import FloatingLabel from 'react-bootstrap/FloatingLabel'
import Spinner from 'react-bootstrap/Spinner'
import Alert from 'react-bootstrap/Alert'

import Select from 'components/Select'

import { fetcher } from 'lib/utils'

import styles from 'styles/select.module.scss'

const UpdateField = ({ value, setValue }) => {
  const handleChange = (event) => {
    setValue(event.target.value)
  }

  return <input onChange={handleChange} type="text" value={value ? value:''} />
}

const DataRow = ({ unchangableAttributes, fetchedAttributes, hidden, selectable, row, entity, mutate, setMainError }) => {
  const [isUpdating, setIsUpdating] = useState(false)
  const [updateError, setUpdateError] = useState<string>()
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string>()

  const inputRow = _.clone(row)
  Object.keys(inputRow).forEach(key => {
    if (inputRow[key] === null) inputRow[key] = ''
    inputRow[key] = inputRow[key].toString()
  })
  const [updatedRow, setUpdatedRow] = useState(inputRow)

  const handleUpdate = async () => {
    setIsUpdating(true)
    setUpdateError(null)
    const formattedRow = _.clone(updatedRow)
    Object.keys(formattedRow).forEach(key => {
      if (formattedRow[key] === '') formattedRow[key] = null
    })
    const response = await fetch(`/api/entities/${entity}/${row.id}`, {
      method: 'PUT',
      body: JSON.stringify(formattedRow)
    })

    const responseMessage = await response.json()

    if (!response.ok) {
      setUpdateError('error')
      setMainError(responseMessage.err)
    } else {
      mutate(`/api/entities/${entity}`)
    }

    setIsUpdating(false)
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    setDeleteError(null)
    const response = await fetch(`/api/entities/${entity}/${row.id}`, {
      method: 'DELETE'
    })

    const responseMessage = await response.json()

    if (!response.ok) {
      setDeleteError('error')
      setMainError(responseMessage.err)
    } else {
      mutate(`/api/entities/${entity}`)
    }

    setIsDeleting(false)
  }

  const setValue = (key, value) => {
    const tempRow = _.clone(updatedRow)
    tempRow[key] = value
    setUpdatedRow(tempRow)
  }

  const handleSelect = (field, value) => {
    const tempRow = _.clone(updatedRow)
    tempRow[field] = value ? value.id:""
    setUpdatedRow(tempRow)
  }

  return (
    <TableRow>
      {Object.entries(updatedRow).map(([key, cell]) => {
        if (unchangableAttributes.includes(key) && !hidden.includes(key)) {
          <TableCell key={key}>
            {key}
          </TableCell>
        }

        if (selectable[key] && !hidden.includes(key)) {
          const formattedData = fetchedAttributes[key].data.rows.map(h => {
            let label = h[selectable[key].columns[0]]

            selectable[key].columns.slice(1).forEach(column => {
              label += ` ${h[column]}`
            })

            return {
              id: h.id,
              label
            }
          })

          const value = _.find(formattedData, ['id', Number(updatedRow[key])])

          return (
            <TableCell key={key}>
              <Select value={value}  title={selectable[key].title} data={formattedData} handleSelect={(_, value) => handleSelect(key, value)} />
            </TableCell>
          )
        }

        if (!hidden.includes(key)) {
          return (
            <TableCell key={key}>
              <UpdateField value={cell} setValue={value => setValue(key, value)}/>
            </TableCell>
          )
        }
      })}
      <TableCell style={{minWidth: '95px'}}>
        {_.isEqual(updatedRow, inputRow) ?
          <></>
          :
          <>
            {isUpdating ?
              <Spinner size="sm" variant="secondary" style={{ margin: 'auto' }} animation="grow" />
              :
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Button onClick={handleUpdate} variant="secondary" size="sm">
                  update
                </Button>
                {updateError &&
                  <span style={{ color: 'red' }}>{updateError}</span>
                }
              </div>
            }
          </>
        }
      </TableCell>
      <TableCell style={{minWidth: '95px'}}>
        {isDeleting ?
          <Spinner size="sm" variant="danger" style={{ margin: 'auto' }} animation="grow" />
          :
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Button onClick={handleDelete} variant="danger" size="sm">
              delete
            </Button>
            {deleteError &&
              <span style={{ color: 'red' }}>{deleteError}</span>
            }
          </div>
        }
      </TableCell>
    </TableRow>
  )
}

const CreateEntity = ({ fetchedAttributes, unchangableAttributes, hidden, selectable, headers, entity, mutate, setMainError }) => {
  const temp = {}

  headers.forEach(header => {
    temp[header] = ''
  })

  const [newEntity, setNewEntity] = useState(temp)
  const [isCreating, setIsCreating] = useState(false)
  const [createError, setCreateError] = useState<string>()

  const handleChange = (event, field) => {
    const tempEntity = _.clone(newEntity)
    tempEntity[field] = event.target.value
    setNewEntity(tempEntity)
  }

  const handleCreate = async () => {
    setIsCreating(true)
    setCreateError(null)
    const response = await fetch(`/api/entities/${entity}`, {
      method: 'POST',
      body: JSON.stringify(newEntity)
    })

    const responseMessage = await response.json()

    if (!response.ok) {
      setCreateError('error')
      setMainError(responseMessage.err)
    } else {
      mutate(`/api/entities/${entity}`)
    }

    setIsCreating(false)
  }

  const handleSelect = (field, value) => {
    const tempEntity = _.clone(newEntity)
    tempEntity[field] = value ? value.id:""
    setNewEntity(tempEntity)
  }

  return (
    <>
      {headers.map((header, index) => {
        if (unchangableAttributes.includes(header) && !hidden.includes(header)) {
          return (
            <TableCell key={index}>
              {header}
            </TableCell>
          )
        }
        if (selectable[header] && !hidden.includes(header)) {
          const formattedData = fetchedAttributes[header].data.rows.map(h => {
            let label = h[selectable[header].columns[0]]

            selectable[header].columns.slice(1).forEach(column => {
              label += ` ${h[column]}`
            })

            return {
              id: h.id,
              label
            }
          })

          return (
            <TableCell key={header}>
              <Select value={_.find(formattedData, ['id', newEntity[header]])} title={selectable[header].title} data={formattedData} handleSelect={(_, value) => handleSelect(header, value)} />
            </TableCell>
          )
        }
        if (!hidden.includes(header)) {
          return (
            <TableCell key={header}>
              <FloatingLabel
                controlId="floatingInput"
                label={header}
              >
                <Form.Control value={newEntity[header]} onChange={(e) => handleChange(e, header)} type="text" placeholder="" />
              </FloatingLabel>
            </TableCell>
          )
        }
      })}
      <TableCell style={{ textAlign: 'center', background: 'white'}} colSpan={2}>
        {isCreating ?
          <Spinner size="sm" variant="primary" style={{ margin: 'auto' }} animation="grow" />
        :
          <div style={{display: 'flex', flexDirection: 'column'}}>
            <Button onClick={handleCreate} style={{ width: '100%' }} variant="primary">
              Create
            </Button>
            {createError &&
            <span style={{color: 'red'}}>{createError}</span>
            }
          </div>
        }
      </TableCell>
    </>
  )

}

const EditDeleteViewTable = ({ rows, hidden, selectable, unchangableAttributes, entity, mutate }) => {
  const [mainError, setMainError] = useState()
  const headers = Object.keys(rows[0])

  const fetchedAttributes = {}

  Object.entries(selectable).forEach(([key, value]) => {
    const fetchUrl = `/api/entities/${value['entity']}`
    const { data, error } = useSWR(fetchUrl, fetcher, {revalidateOnFocus: false, revalidateOnReconnect: false})

    fetchedAttributes[key] = {
      data,
      error
    }
  })

  let lastError
  if (!(_.every(fetchedAttributes, a => {
    if (a.error) {
      lastError = a.error
    }
    return !(a.error)
  }))) return <div>failed to load: {lastError?.info?.err}</div>
  if (!(_.every(fetchedAttributes, a => a.data))) return <Spinner style={{ margin: 'auto' }} animation="grow" />

  if (rows.length === 0) {
    return <div style={{margin: 'auto'}}>no data</div>
  }

  return (
    <>
      {mainError &&
        <Alert variant="danger" onClose={() => setMainError(null)} dismissible>
          {mainError}
        </Alert>
      }
      <TableContainer style={{background: 'white'}}>
        <MUITable>
          <TableHead>
            <TableRow style={{ background: 'white', boxShadow: '0px 7px 3px -7px #000000, 5px 5px 15px 5px rgba(0,0,0,0)' }}>
              <CreateEntity fetchedAttributes={fetchedAttributes} hidden={hidden} selectable={selectable} unchangableAttributes={unchangableAttributes} setMainError={setMainError} headers={headers} entity={entity} mutate={mutate}/>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) =>
              <DataRow fetchedAttributes={fetchedAttributes} hidden={hidden} selectable={selectable} unchangableAttributes={unchangableAttributes} setMainError={setMainError} key={`${entity}-${index}`} row={row} entity={entity} mutate={mutate}/>
            )}
          </TableBody>
        </MUITable>
      </TableContainer>
    </>
  )
}

export default EditDeleteViewTable
