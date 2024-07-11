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
    const [inputValues, setInputValues] = useState({})
    const [error, setError] = useState('')
    const [shake, setShake] = useState(false)

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
        const requiredHeaders = getRequiredHeaders(selectedMenuItem)
        let preventSubmit = false;
        requiredHeaders.forEach((header)=>{
            if (!(header in inputValues)){
                preventSubmit = true;
            }
        })
        if(preventSubmit){
            setShake(true)
            setTimeout(() => setShake(false), 1000);
            setError("All fields are required.")
            return;
        }
        if (process.env.NODE_ENV == "development"){
            setOpenAdd(false)
            setAlert("success", "Success", "Transaction added successfully.")
        }
        else{
            google.script.run.withSuccessHandler((data) => {
                setOpenAdd(false)
                setAlert("success", "Success", "Transaction added successfully.")
            }).withFailureHandler((error) => {
                setOpenAdd(false)
                setAlert("error", "Error", "Failed to add transaction.", 5)
            }).addRow(selectedMenuItem, inputValues);
        }
    }

    const handleInstrumentSelected = (suggestion) => {
        setSelectedMenuItem(suggestion);
    };

    const handleInputChange = (key, value) => {
        setInputValues(prevData => ({ ...prevData, [key]: value }));
    };

    return (
        <div className="add">
            <div className={`modal ${shake ? 'shake' : ''}`}>
                <span className="close" onClick={()=>setOpenAdd(false)}>X</span>
                <h1> Add new transaction</h1>
                <FormControl
                    fullWidth
                >
                    <InputLabel>Instrument Type</InputLabel>
                    <Select
                        value={instruments.includes(selectedMenuItem) ? selectedMenuItem : ''}
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
                    instrument={selectedMenuItem}
                    requiredHeaders={getRequiredHeaders(selectedMenuItem)}
                    contentColumnMap={contentColumnMap}
                    inputValues={inputValues}
                    onInputChange={handleInputChange}
                    error={error}
                />
                {error != '' && <p className="error">{error}</p>}
                <div className="modalFooter">
                    {instruments.includes(selectedMenuItem) &&
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