import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Spinner from 'react-bootstrap/Spinner'

type SelectParams = {
  title: string
  handleSelect
  data
  value?
}

const Select = ({ title, handleSelect, data, value }: SelectParams) => {
  if (!data) return <Spinner style={{ margin: 'auto' }} animation="grow" />

  return (
    <Autocomplete
      id="combo-box-demo"
      options={data}
      sx={{ width: 300 }}
      value={value}
      onChange={handleSelect}
      renderInput={(params) => <TextField {...params} label={title} />}
    />
  )
}

export default Select
