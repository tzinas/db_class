import TableContainer from '@mui/material/TableContainer'
import MUITable from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableBody from "@mui/material/TableBody"
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'


type RowType = {
  group: string
  content: string[][]
} | string[]

type TableProps = {
  headers: string[]
  data: RowType[]
};

const Row = ({ row }) => {
  if (Array.isArray(row)) {
    return (
      <TableRow>
        {row.map((content, index) => 
          <TableCell key={index}>
            {content}
          </TableCell>
        )}
      </TableRow>
    )
  }

  return (
    <>
      <TableRow>
        <TableCell rowSpan={row.content.length + 1}>
          {row.group}
        </TableCell>
      </TableRow>
      {row.content.map((newRow: string[][], index: number) => 
        <Row row={newRow} key={index}/>
      )}
    </>
  )
}

const Table = ({ headers, data }: TableProps) => {
  return (
    <TableContainer>
      <MUITable>
        <TableHead>
          <TableRow>
            {headers.map((header, index) =>
              <TableCell key={index}>
                {header}
              </TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, index) =>
            <Row row={row} key={index}/>
          )}
        </TableBody>
      </MUITable>
    </TableContainer>
  )
}

export default Table
