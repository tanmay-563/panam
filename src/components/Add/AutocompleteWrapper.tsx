import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

const MAX_SUGGESTIONS = 5;

function AutocompleteWrapper({
                                 suggestions,
                                column
}) {
    const filterOptions = (options, state) => {
        return options.slice(0, MAX_SUGGESTIONS);
    };

    return (
        <Autocomplete
            disablePortal
            freeSolo
            limitTags={5}
            className="autocomplete-box"
            filterOptions={filterOptions}
            options={suggestions}
            renderInput={(params) =>
                <TextField
                    {...params}
                    label={column}
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
                    borderColor: 'var(--ultra-soft-color)',
                },
                '&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'var(--soft-color)',
                },
            }}
        />
    );
}

export default AutocompleteWrapper