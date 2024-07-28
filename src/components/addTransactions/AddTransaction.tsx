import React, {useMemo, useState} from 'react'
import Fields from "./Fields";
import {FormControl, InputLabel, MenuItem, Select} from '@mui/material';
import Loading from "../Loading";
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';

const AddTransaction = ({
                 instruments,
                 transactionsColumnMap,
                 selectedMenuItem,
                 setSelectedMenuItem,
                 setOpenAdd,
                setAlert,
                metadata
             }) => {
    const instrumentsMetadata = metadata?.instrument;

    if(!instrumentsMetadata)
        return <div></div>

    const navigate = useNavigate();
    const [inputValues, setInputValues] = useState({})
    const [error, setError] = useState('')
    const [shake, setShake] = useState(false)
    const [loading, setLoading] = useState(false)
    const [columnMetadata, setColumnMetadata] = useState({})
    const [requiredHeaders, setRequiredHeaders] = useState([])

    useMemo(() => {
        if(instruments.includes(selectedMenuItem)){
            try{
                const colData = metadata?.column?.filter(item => item.Instrument.toLowerCase() === selectedMenuItem.toLowerCase());
                setColumnMetadata(colData);
                setRequiredHeaders(colData.filter(metadata => metadata.IsAutomated != true).map(metadata => metadata.Column));
            }
            catch (e){
                console.error(e)
                setColumnMetadata({})
                setRequiredHeaders([])
            }
        }
        else
            setColumnMetadata({});
    }, [selectedMenuItem, instruments, metadata?.column]);

    const handleSubmit = () => {
        if (loading) return;

        const formInvalid = requiredHeaders.some(header => !(header in inputValues));

        if (formInvalid) {
            setShake(true);
            setTimeout(() => setShake(false), 1000);
            setError("All fields are required.");
            return;
        }

        const successHandler = (response) => {
            setLoading(false);
            if(response.statusCode >= 200 && response.statusCode < 300){
                setOpenAdd(false);
                setAlert("success", "Success", "Refresh to see updated data.", 10);
            }
            else{
                setAlert("error", "Error", `${response.status} Click <a href=${response.instrumentSheetUrl} target="_blank"><b>here</b></a> to open the sheet.`, 15);
            }
        };

        const errorHandler = () => {
            setLoading(false);
            setOpenAdd(false);
            setAlert("error", "Error", "Failed to add transaction.", 10);
        };

        if (process.env.NODE_ENV === "development") {
            setLoading(true);
            setTimeout(() => {
                setLoading(false);
                successHandler();
            }, 1500);
        } else {
            setLoading(true);
            // @ts-ignore
            google.script.run
                .withSuccessHandler((response) => {successHandler(response)})
                .withFailureHandler(errorHandler)
                .addRow(selectedMenuItem, inputValues);
        }
    };

    const handleInstrumentSelected = (suggestion) => {
        setSelectedMenuItem(suggestion);
        navigate('transactions/:'+suggestion)
    };

    const handleInputChange = (key, value) => {
        setInputValues(prevData => ({ ...prevData, [key]: value }));
    };

    return (
        <div className="add">
            <div className={`modal ${shake ? 'shake' : ''}`} >
                <span className="close" onClick={()=>setOpenAdd(false)}>
                    <CloseIcon className="close-icon"/>
                </span>
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
                        {instrumentsMetadata.map((instrument) => (
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
                <Fields
                    instrument={selectedMenuItem}
                    requiredHeaders={requiredHeaders}
                    transactionsColumnMap={transactionsColumnMap}
                    inputValues={inputValues}
                    onInputChange={handleInputChange}
                    columnMetadata={columnMetadata}
                    error={error}
                />
                {error != '' && <p className="error">{error}</p>}
                <div className="modalFooter">
                    {instruments.includes(selectedMenuItem) ?
                        (loading ?
                        <Loading className="submit"/> :
                        <div className="submit" onClick={handleSubmit}>
                            SUBMIT
                        </div> ) :
                        <div></div>
                    }
                </div>
            </div>
        </div>
    )
}

export default AddTransaction