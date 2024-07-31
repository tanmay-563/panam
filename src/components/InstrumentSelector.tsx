import {FormControl, InputLabel, MenuItem, Select} from "@mui/material";
import React from "react";

const InstrumentSelector = ({selectedInstrument, onChange, instrumentMetadata}) => {
    return (
        <FormControl
            fullWidth
        >
            <InputLabel
                sx={{
                    color: 'var(--ultra-soft-color)',
                    '&.Mui-focused': {
                        color: 'var(--soft-color)',
                    },
                }}>
                Instrument Type
            </InputLabel>
            <Select
                value={selectedInstrument ? selectedInstrument : ''}
                onChange={(e) => onChange(e.target.value)}
                displayEmpty
                label="Instrument Type"
                sx = {{
                    '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'var(--ultra-soft-color)',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'var(--soft-color)',
                    },
                    '&:not(.Mui-disabled):hover::before': {
                        borderColor: 'white',
                    },
                    '& .MuiSvgIcon-root': {
                        color: 'var(--soft-color)',
                    },
                    '& .MuiSelect-select': {
                        color: 'var(--soft-color)',
                    }
                }}
            >
                {instrumentMetadata.map((instrument) => (
                    <MenuItem
                        key={instrument.Name.toLowerCase()}
                        value={instrument.Name.toLowerCase()}
                        sx={{
                            color: "var(--dark-color)",
                        }}
                    >
                        {instrument["Label"]}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    )
}

export default InstrumentSelector;