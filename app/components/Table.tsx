import TableContainer from '@mui/material/TableContainer'
import MUITable from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableBody from "@mui/material/TableBody"
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'

import styles from 'styles/table.module.scss'

const Row = ({ headers, hidden, row, handleClick }) => {
  const handleOnClick = () => {
    if (handleClick) {
      handleClick(row.id)
    }
  }

  return (
    <TableRow className={handleClick ? styles.row:null} onClick={handleOnClick}>
      {headers.map((header, index) => {
        if (!hidden || !hidden.includes(header)) {
          return (
            <TableCell key={index}>
              {row[header]}
            </TableCell>
          )
        }
      })}
    </TableRow>
  )
}

type TableParams = {
  rows: {[key: string]: string | number}[]
  hidden?: string[]
  handleClick?
}

const Table = ({ rows, hidden, handleClick }: TableParams) => {
  if (rows.length === 0) {
    return <div style={{margin: 'auto'}}>no data</div>
  }

  const headers = Object.keys(rows[0])

  return (
    <TableContainer>
      <MUITable>
        <TableHead>
          <TableRow style={{top: 0, position: 'sticky', background: 'white', boxShadow: '0px 7px 3px -7px #000000, 5px 5px 15px 5px rgba(0,0,0,0)'}}>
            {headers.map((header, index) => {
              if (!hidden || !hidden.includes(header)) {
                return (
                  <TableCell key={index} style={{ fontWeight: 'bold' }}>
                    {header}
                  </TableCell>
                )
              }
            })}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) =>
            <Row handleClick={handleClick} headers={headers} hidden={hidden} row={row} key={index}/>
          )}
        </TableBody>
      </MUITable>
    </TableContainer>
  )
}

export default Table
