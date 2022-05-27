import { useState } from 'react'
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
import _ from 'lodash'

const UpdateField = ({ value, setValue }) => {
  const handleChange = (event) => {
    setValue(event.target.value)
  }

  return <input onChange={handleChange} type="text" value={value ? value:''} />
}

const DataRow = ({ row, entity, mutate }) => {
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

    if (!response.ok) {
      setUpdateError('error')
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

    if (!response.ok) {
      setDeleteError('error')
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

  return (
    <TableRow>
      {Object.entries(updatedRow).map(([key, cell]) =>
        <TableCell key={key}>
          <UpdateField value={cell} setValue={value => setValue(key, value)}/>
        </TableCell>
      )}
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

const CreateEntity = ({ headers, entity, mutate }) => {
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

    if (!response.ok) {
      setCreateError('error')
    } else {
      mutate(`/api/entities/${entity}`)
    }

    setIsCreating(false)
  }

  return (
    <>
      {headers.map((header, index) =>
        <TableCell key={index}>
          <FloatingLabel
            controlId="floatingInput"
            label={header}
          >
            <Form.Control value={newEntity[header]} onChange={(e) => handleChange(e, header)} type="email" placeholder="name@example.com" />
          </FloatingLabel>
        </TableCell>
      )}
      <TableCell style={{ textAlign: 'center', background: 'white', position: 'sticky', top: '0'}} colSpan={2}>
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

const EditDeleteViewTable = ({ rows, entity, mutate }) => {
  if (rows.length === 0) {
    return <div style={{margin: 'auto'}}>no data</div>
  }

  const headers = Object.keys(rows[0])


  return (
    <TableContainer style={{background: 'white'}}>
      <MUITable>
        <TableHead>
          <TableRow style={{ background: 'white', position: 'sticky', top: '0',  boxShadow: '0px 7px 3px -7px #000000, 5px 5px 15px 5px rgba(0,0,0,0)' }}>
            <CreateEntity headers={headers} entity={entity} mutate={mutate}/>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) =>
            <DataRow key={`${entity}-${index}`} row={row} entity={entity} mutate={mutate}/>
          )}
        </TableBody>
      </MUITable>
    </TableContainer>
  )
}

export default EditDeleteViewTable
