import React, {useState} from 'react'
import TextField from '@mui/material/TextField'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const DateRangePicker = ({ fromDate, setFromDate, toDate, setToDate }) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <div style={{display: 'flex', alignItems: 'center'}}>
        <div style={{marginRight: '20px'}}>
          <DatePicker
            label="From"
            value={fromDate}
            onChange={(newValue) => {
              setFromDate(newValue)
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
              setToDate(newValue)
            }}
            renderInput={(params) => <TextField {...params} />}
          />
        </div>
      </div>
    </LocalizationProvider>
  )
}

export default DateRangePicker
