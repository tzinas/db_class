import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Spinner from 'react-bootstrap/Spinner'

const Select = ({ title, handleSelect, data }) => {
  if (!data) return <Spinner style={{ margin: 'auto' }} animation="grow" />

  return (
    <Autocomplete
      id="combo-box-demo"
      options={data}
      sx={{ width: 300 }}
      onChange={handleSelect}
      renderInput={(params) => <TextField {...params} label={title} />}
    />
  )
}

export default Select
