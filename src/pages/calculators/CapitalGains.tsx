import React from "react";
import {ErrorMessage, Field, Form, Formik} from "formik";
import * as Yup from "yup";
import Loading from "../../components/Loading";
import TextField from "@mui/material/TextField";
import {InputAdornment} from "@mui/material";
import {getCapitalGainsData} from "../../utils/calculator.utils";

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

    getCapitalGainsData(transactionsRowMap, "mutualfund")
    const instrumentMetadata = metadata.instrument
    const initialValues = {
        instrument: '',
        shortTermPeriod: 12,
        shortTermTax: 20,
        longTermTax: 12.5,
    };

    const handleSubmit = (values, { setSubmitting, setValues }) => {
        console.log("here")
        console.log(values)
        setSubmitting(false);
    }

    return (
        <div className="form-page">
            <div className="form-page-title">
                Capital Gains Calculator
            </div>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
                validateOnChange={false}
            >
                {({ values, setValues, errors, isSubmitting }) => (
                    <Form className="form">
                        <div className="form-top calculator-form-top">
                            <div className="form-field">
                                <div className="select-container">
                                    <div className="select-field calculator-field">
                                        <Field as="select" name="instrument" className="select">
                                            {values.instrument == '' &&
                                                <option value="" disabled>Instrument Type</option>}
                                            {instrumentMetadata.map((item) => (
                                            <option key={item.Name} value={item.Name}>
                                                {item.Label}
                                            </option>
                                            ))}
                                    </Field>
                                    {values.instrument != '' &&
                                        <div className="select-label-container">
                                            <label htmlFor="instrument" className="select-label">
                                                Instrument Type
                                            </label>
                                        </div>
                                    }
                                    </div>
                                    <ErrorMessage name="instrument" component="div" className="error-text"/>
                                </div>
                            </div>
                            <div className="form-field">
                                <Field component={MuiTextField} type="number" name="shortTermPeriod" size="small"
                                       label="Short Term Period" min="0"
                                       InputProps={{
                                           endAdornment:
                                               <InputAdornment position="end">
                                                months
                                               </InputAdornment>,
                                       }}/>
                                <ErrorMessage name="shortTermPeriod" component="div" className="error-text"/>
                            </div>
                            <div className="form-field">
                                <Field component={MuiTextField} type="number" step="0.01" name="shortTermTax" size="small"
                                       label="Short Term Tax" min="0" max="100"
                                       InputProps={{
                                            endAdornment:
                                                <InputAdornment position="end">
                                                    %
                                                </InputAdornment>,
                                        }}/>
                                <ErrorMessage name="shortTermTax" component="div" className="error-text"/>
                            </div>
                            <div className="form-field">
                                <Field component={MuiTextField} type="number" name="longTermTax" size="small"
                                       label="Long Term Tax" min="0" max="100"
                                       InputProps={{
                                           endAdornment:
                                               <InputAdornment position="end">
                                                   %
                                               </InputAdornment>,
                                       }}/>
                                <ErrorMessage name="longTermTax" component="div" className="error-text"/>
                            </div>
                        </div>
                        {isSubmitting ?
                            <Loading className="submit"/> :
                            <button type="submit" disabled={isSubmitting} className="submit calculator-submit">
                                SUBMIT
                            </button>
                        }
                        <div className="calculated-data">

                        </div>
                    </Form>
                    )}

            </Formik>
        </div>
    )
}

export default CapitalGains