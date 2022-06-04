import TableContainer from '@mui/material/TableContainer'
import MUITable from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableBody from "@mui/material/TableBody"
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'

const Row = ({ headers, row }) => {
  return (
    <TableRow>
      {headers.map((header, index) =>
        <TableCell key={index}>
          {row[header]}
        </TableCell>
      )}
    </TableRow>
  )
}

const Table = ({ rows }) => {
  if (rows.length === 0) {
    return <div style={{margin: 'auto'}}>no data</div>
  }

  const headers = Object.keys(rows[0])

  return (
    <TableContainer>
      <MUITable>
        <TableHead>
          <TableRow style={{top: 0, position: 'sticky', background: 'white', boxShadow: '0px 7px 3px -7px #000000, 5px 5px 15px 5px rgba(0,0,0,0)'}}>
            {headers.map((header, index) =>
              <TableCell key={index} style={{fontWeight: 'bold'}}>
                {header}
              </TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) =>
            <Row headers={headers} row={row} key={index}/>
          )}
        </TableBody>
      </MUITable>
    </TableContainer>
  )
}

export default Table
