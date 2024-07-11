import React, {useEffect, useRef, useState} from 'react'
import Fields from "./Fields";
import {Select, MenuItem, FormControl, InputLabel} from '@mui/material';

const Add = ({
                 instruments,
                 headerMap,
                 contentColumnMap,
                 selectedMenuItem,
                 setSelectedMenuItem,
                 setOpenAdd,
                setAlert,
                config
             }) => {
    const instrumentsConfig = config?._instruments || {};
    const [selectedInstrument, setSelectedInstrument] = useState('');
    let inputValues = {}

    useEffect(()=>{
        console.log("asel " + selectedMenuItem)
        if(instruments.includes(selectedMenuItem)){
            setSelectedInstrument(selectedMenuItem)
        }
    }, [selectedMenuItem])

    const getRequiredHeaders = (instrument) =>{
        try{
            let columnConfig= config["_columns"].filter(item => item.Instrument.toLowerCase() === instrument.toLowerCase());
            let isAutomatedColumns = columnConfig.filter(config => config.isAutomated == true).map(config => config.Column);
            return headerMap[instrument].filter(header => !isAutomatedColumns.includes(header));
        }
        catch (e){
            return headerMap[instrument]
        }
    }

    const handleSubmit = () =>{
        const requiredHeaders = getRequiredHeaders(selectedInstrument)
        let preventSubmit = false;
        requiredHeaders.forEach((header)=>{
            if (!(header in inputValues)){
                preventSubmit = true;
            }
        })
        if(preventSubmit){
            setAlert("warning", "Failed", "All fields are required.", 5)
            return;
        }
        if (process.env.NODE_ENV == "development"){
            setOpenAdd(false)
            setAlert("success", "Success", "Transaction added successfully.")
        }
        else{
            google.script.run.withSuccessHandler((data) => {
                console.log("success!")
                setOpenAdd(false)
                setAlert("success", "Success", "Transaction added successfully.")
            }).withFailureHandler((error) => {
                setAlert("error", "Error", "Failed to add transaction.", 5)
            }).addRow(selectedInstrument, inputValues);
        }
    }

    const handleInstrumentSelected = (suggestion) => {
        setSelectedInstrument(suggestion);
        setSelectedMenuItem(suggestion);
    };

    return (
        <div className="add">
            <div className="modal">
                <span className="close" onClick={()=>setOpenAdd(false)}>X</span>
                <h1> Add new transaction</h1>
                <FormControl
                    fullWidth
                >
                    <InputLabel>Instrument Type</InputLabel>
                    <Select
                        value={selectedInstrument}
                        onChange={(e) => handleInstrumentSelected(e.target.value)}
                        displayEmpty
                        label="Instrument Type"
                        sx = {{
                            '& .modal .MuiFormControl-root .MuiFormLabel-root': {
                                color: 'var(--ultra-soft-color)',
                            },
                            '& .MuiSelect-select': {
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
                        }}
                    >
                        {instrumentsConfig.map((instrument) => (
                            <MenuItem
                                key={instrument.Name.toLowerCase()}
                                value={instrument.Name.toLowerCase()}
                                sx={{
                                    color: "var(--dark-color)",
                                }}
                            >
                                {instrument["Display Name"]}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Fields
                    instrument={selectedInstrument}
                    requiredHeaders={getRequiredHeaders(selectedInstrument)}
                    contentColumnMap={contentColumnMap}
                    inputValues={inputValues}
                />
                <div className="modalFooter">
                    {selectedInstrument != '' &&
                        <div className="submit" onClick={handleSubmit}>
                            SUBMIT
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}

export default Add