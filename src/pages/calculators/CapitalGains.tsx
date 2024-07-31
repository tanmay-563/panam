import React, {useState} from "react";
import {ErrorMessage, Field, Form, Formik} from "formik";
import * as Yup from "yup";
import Loading from "../../components/Loading";
import TextField from "@mui/material/TextField";
import {FormControl, InputAdornment, InputLabel, MenuItem, Select} from "@mui/material";
import {getCapitalGainsData} from "../../utils/calculator.utils";
import {Simulate} from "react-dom/test-utils";
import select = Simulate.select;
import InstrumentSelector from "../../components/InstrumentSelector";

const validationSchema = Yup.object().shape({
    instrument: Yup.string().required('Instrument is required'),
    shortTermPeriod: Yup.number().min(0, 'Minimum 0').required("Short Term Period is required"),
    shortTermTax: Yup.number().min(0, 'Minimum 0').max(100, 'Maximum 100').required("Short Term Tax is required"),
    longTermTax: Yup.number().min(0, 'Minimum 0').max(100, 'Maximum 100').required("Long Term Tax is required"),
});

const MuiTextField = ({ field, form, ...props }) => {
    return <TextField
        {...field}
        {...props}
        variant="outlined"
        autoComplete='off'
        sx={{
            borderRadius: '5px',
            width: '100%',
            '& .MuiOutlinedInput-root': {
                '& fieldset':{
                    borderColor: 'var(--max-soft-color)'
                },
                '&:hover fieldset': {
                    borderColor: 'var(--soft-color)'
                }
            },
            '& .MuiInputBase-root': {
                color: 'var(--soft-color)'
            },
            '& .MuiFormLabel-root': {
                color: 'var(--soft-color)',
                fontWeight: 'lighter',
            },
            "& .MuiFilledInput-root": {
                background: 'red',
            },
            '& .MuiTypography-root':{
                color: 'var(--ultra-soft-color)',
                fontWeight: 'ligher',
                fontSize: '12px',
            }
        }}
    />;
};

const CapitalGains = ({   metadata,
                          transactionsRowMap}) => {
    if(!metadata)
        return <div></div>

    const [selectedInstrument, setSelectedInstrument] = useState('')
    getCapitalGainsData(transactionsRowMap, "mutualfund", 12)
    const instrumentMetadata = metadata.instrument
    const initialValues = {
        instrument: '',
        shortTermPeriod: 12,
        shortTermTax: 20,
        longTermTax: 12.5,
    };

    const handleChange = (value) => {
        console.log("here")
        console.log(value)
        setSelectedInstrument(value)
    }

    return (
        <div className="form-page">
            <div className="form-page-title">
                Capital Gains Calculator
            </div>
            <div className="form calculator-form">
                <InstrumentSelector
                    selectedInstrument={selectedInstrument}
                    onChange={handleChange}
                    instrumentMetadata={instrumentMetadata}
                />
            </div>
        </div>
    )
}

export default CapitalGains