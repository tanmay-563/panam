import AutocompleteWrapper from "./AutocompleteWrapper";
import {getDataTypeMap} from "../../utils/common";
import TextField from "@mui/material/TextField";
import * as React from "react";
import {useState} from "react";

const getCurrentDate = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
};

const Fields = ({
                       instrument,
                       transactionsColumnMap,
                       requiredHeaders,
                        inputValues,
                        onInputChange,
                        columnMetadata,
                        error
                   }) => {
    if(!requiredHeaders)
        return <div/>

    const [selectedDate, setSelectedDate] = useState(getCurrentDate);

    const handleDateChange = (event) => {
        setSelectedDate(event.target.value);
    };

    let uniqueValues = {}
    requiredHeaders.forEach(columnName => {
        uniqueValues[columnName] = Array.from(new Set(transactionsColumnMap[instrument][columnName]));
    });

    const dataTypeMap = getDataTypeMap(columnMetadata)

    return (
        <div className="fields">
            {requiredHeaders.map(columnName => (
                <div key={columnName} className="field">
                    {   dataTypeMap[columnName] == "text" ?
                        <AutocompleteWrapper
                            suggestions={uniqueValues[columnName]}
                            column={columnName}
                            inputValues={inputValues}
                            handleInputChange={onInputChange}
                            error={error}
                        /> :
                            dataTypeMap[columnName] == "date"?
                            <TextField
                                label={columnName}
                                type="date"
                                className="text-field"
                                value={selectedDate}
                                onChange={handleDateChange}
                                InputLabelProps={{
                                    style: { color: 'var(--ultra-soft-color)' },
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        '&:hover fieldset': {
                                            borderColor: 'var(--soft-color)'
                                        }
                                    },
                                }}
                            /> :
                            <TextField
                                label={columnName}
                                required
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
                                }}
                            />
                    }
                </div>
            ))}
        </div>
    );
}

export default Fields