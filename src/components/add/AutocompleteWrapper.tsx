import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import {useEffect, useState} from "react";

const MAX_SUGGESTIONS = 5;

function AutocompleteWrapper({
                                 suggestions,
                                 column,
                                 inputValues,
                                 handleInputChange,
                                 error
}) {
    const [value, setValue] = useState('')

    useEffect(()=>{
        if (Object.keys(inputValues).includes(column))
            setValue(inputValues[column])
        else
            setValue('')
    }, [suggestions])

    const filterOptions = (options, state) => {
        return options.slice(0, MAX_SUGGESTIONS);
    };

    const onInputChange = (event, value) => {
        setValue(value);
        if(handleInputChange){
            handleInputChange(column, value)
        }
    }

    return (
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
                '& .MuiAutocomplete-input': {
                    color: 'var(--ultra-soft-color)',
                },
                "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                    borderColor: error && value == '' ? 'red' : 'var(--ultra-soft-color)',
                },
                '&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'var(--soft-color)',
                },
            }}
        />
    );
}

export default AutocompleteWrapper