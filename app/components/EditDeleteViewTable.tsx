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

const UpdateField = ({ value }) => {
  const [changingValue, setChangingValue] = useState(value ? value:'')

  const handleChange = (input) => {
    setChangingValue(input.target.value)
  }

  return <input onChange={handleChange} type="text" value={changingValue} />
}

const DataRow = ({ row }) => {
  return (
    <TableRow>
      {Object.values(row).map((cell, index) =>
        <TableCell key={index}>
          <UpdateField value={cell} />
        </TableCell>
      )}
      <TableCell>
        <Button variant="secondary" size="sm">
          update
        </Button>
      </TableCell>
      <TableCell>
        <Button variant="danger" size="sm">
          delete
        </Button>
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
            <DataRow key={`${entity}-${index}`} row={row}/>
          )}
        </TableBody>
      </MUITable>
    </TableContainer>
  )
}

export default EditDeleteViewTable
