import {FormControl, InputLabel, MenuItem, Select} from "@mui/material";
import React, {useState} from "react";
import {getDisplayName} from "../utils/common";

const DeleteInstrument = ({   metadata,
                              setAlert,
                              fetchSheetData,
                              setDialogType,
                              setDialogProps,
                              handleInstrumentDelete}) => {
    const [instrumentToDelete, setInstrumentToDelete] = useState('');
    const instrumentMetadata = metadata?.instrument;

    if(!instrumentMetadata)
        return <div></div>

    const handleInstrumentSelected = (instrument) => {
        setInstrumentToDelete(instrument);
        setDialogType("deleteConfirmation")
        setDialogProps({
            title: "Delete Instrument",
            content: (
                <>
                    Are you certain you wish to delete the instrument {getDisplayName(instrumentMetadata, instrument)}?
                    This action will result in the <strong>deletion of all data</strong> associated with the instrument.
                </>
            ),
            onConfirm: ()=>handleInstrumentDelete(instrument)
        })
    }

    return (
        <div className="delete-instrument">
            <div className="delete-card">
                <span className="label">Select Instrument to delete</span>
                <FormControl>
                    <InputLabel className="placeholder">Instrument Type</InputLabel>
                    <Select
                        value={instrumentToDelete}
                        displayEmpty
                        onChange={(e) => handleInstrumentSelected(e.target.value)}
                        sx = {{
                            width: '200px',
                            '& .MuiFormControl-root .MuiFormLabel-root': {
                                color: 'var(--ultra-soft-color)',
                            },
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
                            '& .MuiSelect-select':{
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
            </div>
        </div>
    )
}

export default DeleteInstrument