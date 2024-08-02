import {FormControl, InputLabel, MenuItem, Select} from "@mui/material";
import React from "react";

const DynamicSelect = ({
                           selectedValue,
                           onSelectionChange,
                           data,
                           valueField,
                           labelField,
                           uniqueId,
                           inputLabel}) => {
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
                {inputLabel}
            </InputLabel>
            <Select
                value={selectedValue ? selectedValue : ''}
                onChange={(e) => onSelectionChange(e.target.value)}
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
                {data && data.map((item) => (
                    <MenuItem
                        key={uniqueId + item[valueField].toLowerCase()}
                        value={item[valueField]}
                        sx={{
                            color: "var(--dark-color)",
                        }}
                    >
                        {item[labelField]}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    )
}

export default DynamicSelect;