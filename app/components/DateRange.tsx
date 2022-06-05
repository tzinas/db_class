import React, {useState} from 'react'
import TextField from '@mui/material/TextField'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const DateRangePicker = ({ fromDate, setFromDate, toDate, setToDate }) => {
  const handleChange = (identifier, newValue) => {
    if (identifier == 'to' && (!fromDate || fromDate <= newValue)) {
      setToDate(newValue)
    }
    if (identifier == 'from' && (!toDate || newValue <= toDate)) {
      setFromDate(newValue)
    }
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <div style={{display: 'flex', alignItems: 'center'}}>
        <div style={{marginRight: '20px'}}>
          <DatePicker
            label="From"
            value={fromDate}
            onChange={(newValue) => {
              handleChange('from', newValue)
            }}
            renderInput={(params) => <TextField {...params} />}
          />
        </div>
        -
        <div style={{marginLeft: '20px'}}>
          <DatePicker
            label="To"
            value={toDate}
            onChange={(newValue) => {
              handleChange('to', newValue)
            }}
            renderInput={(params) => <TextField {...params} />}
          />
        </div>
      </div>
    </LocalizationProvider>
  )
}

export default DateRangePicker
