import { useState } from 'react'
import TableContainer from '@mui/material/TableContainer'
import MUITable from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableBody from "@mui/material/TableBody"
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import Button from 'react-bootstrap/Button'

const UpdateField = ({ value }) => {
  const [changingValue, setChangingValue] = useState(value)

  const handleChange = (input) => {
    setChangingValue(input.target.value)
  }

  return <input onChange={handleChange} type="text" value={changingValue ? changingValue:''} />
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
    </TableRow>
  )
}

const EditDeleteViewTable = ({ rows }) => {
  if (rows.length === 0) {
    return <div style={{margin: 'auto'}}>no data</div>
  }

  const headers = Object.keys(rows[0])


  return (
    <TableContainer style={{margin: '0 30px'}}>
      <MUITable>
        <TableHead>
          <TableRow style={{ background: 'white', position: 'sticky', top: '0' }}>
            {headers.map((header, index) =>
              <TableCell key={index}>
                {header}
              </TableCell>
            )}
            <TableCell>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) =>
            <DataRow key={index} row={row}/>
          )}
        </TableBody>
      </MUITable>
    </TableContainer>
  )
}

export default EditDeleteViewTable
