import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete, {createFilterOptions} from '@mui/material/Autocomplete';
import {useEffect, useState} from "react";

const MAX_SUGGESTIONS = 5;
const defaultFilterOptions = createFilterOptions();

function Field({
                 suggestions,
                 column,
                 inputValues,
                 handleInputChange,
                 dataTypeMap,
                 error
}) {
    const [value, setValue] = useState('')

    useEffect(()=>{
        if (Object.keys(inputValues).includes(column)){
            setValue(inputValues[column])
        }
        else{
            setValue('')
        }
    }, [suggestions])

    const filterOptions = (options, state) => {
        return defaultFilterOptions(options, state).slice(0, MAX_SUGGESTIONS);
    };

    const onInputChange = (event, value) => {
        setValue(value);
        if(handleInputChange){
            handleInputChange(column, value)
        }
    }

    return (
        <>
        {   dataTypeMap[column] == "text" ?
            <Autocomplete
                value={value}
                disablePortal
                freeSolo
                onInputChange={onInputChange}
                filterOptions={filterOptions}
                options={suggestions}
                getOptionLabel={(option) => option || ""}
                renderInput={(params) =>
                    <TextField
                        {...params}
                        label={column}
                        required
                    />
                }
                sx={{
                    width: '200px',
                    '& .MuiFormControl-root .MuiFormLabel-root': {
                        color: 'var(--ultra-soft-color)',
                    },
                    '& .MuiInputBase-input': {
                        fontSize: '14px',
                    },
                    '& .MuiAutocomplete-listbox': {
                        fontSize: '14px',
                    },
                    "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                        borderColor: error && value == '' ? 'red' : 'var(--ultra-soft-color)',
                    },
                    '&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'var(--soft-color)',
                    },
                }}
            /> : dataTypeMap[column] == "date"?
                    <TextField
                        label={column}
                        type="date"
                        className="text-field"
                        value={value}
                        onChange={(event)=>onInputChange(event, event.target.value)}
                        InputLabelProps={{
                            style: { color: 'var(--ultra-soft-color)' },
                            shrink: true,
                        }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '&:hover fieldset': {
                                    borderColor: 'var(--soft-color)'
                                }
                            },
                            '& input[type="date"]::-webkit-calendar-picker-indicator': {
                                filter: 'invert(1)'
                            },
                            "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                                borderColor: error && value == '' ? 'red' : 'var(--ultra-soft-color)',
                            },
                        }}
                    /> :
                    <TextField
                        label={column}
                        required
                        value={value}
                        type="number"
                        onChange={(event)=>onInputChange(event, event.target.value)}
                        className="text-field"
                        InputLabelProps={{
                            style: { color: 'var(--ultra-soft-color)' },
                        }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '&:hover fieldset': {
                                    borderColor: 'var(--soft-color)'
                                }
                            },
                            "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                                borderColor: error && value == '' ? 'red' : 'var(--ultra-soft-color)',
                            },
                        }}
                    />}
        </>
    );
}

export default Field