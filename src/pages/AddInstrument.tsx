import React, {useRef, useState} from 'react';
import {Formik, Form, Field, ErrorMessage, FieldArray} from 'formik';
import * as Yup from 'yup';
import TextField from "@mui/material/TextField";
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import {FormHelperText, IconButton, InputAdornment, InputLabel, Tooltip} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ErrorFocus from "../components/external/ErrorFocus"
import Loading from "../components/Loading";
import IconSelector from "../components/icons/IconSelector";
import {iconMap} from "../components/icons/Icons";

const validationSchema = Yup.object().shape({
    name: Yup.string().matches(/^[a-z]+$/, 'Only lowercase english alphabets allowed').required('Name is required'),
    label: Yup.string().required("Label is required"),
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
                }
            }}
        />;
};

const AddInstrument = ({metadata, setAlert, fetchSheetData}) => {
    if(!metadata)
        return <div></div>
    const sheetMetadata = metadata.sheet
    const [showIconSelector, setShowIconSelector] = useState(false);
    const iconSelectorRef = useRef(null);

    let dataTypeOptions = []
    try{
        dataTypeOptions = sheetMetadata.filter((item) => item.Key.toLowerCase() == "datatypeselectoptions")[0].Value.split(",");
    }
    catch (e){
        dataTypeOptions = ['text']
    }

    const fieldsInitialValue = {
        name: '',
        dataType: dataTypeOptions[0],
        isAutomated: false,
    }

    const initialValues = {
        name: '',
        label: '',
        calculateXirr: true,
        icon: '',
        fields: [fieldsInitialValue]
    };

    const removeField = (i, values, setValues) => {
        const fields = [...values.fields];
        fields.splice(i, 1);
        setValues({ ...values, fields });
    };

    const addField = (values, setValues) => {
        const fields = [...values.fields];
        fields.push(fieldsInitialValue);
        setValues({ ...values, fields });
    };

    const handleSubmit = (values, { setSubmitting, setValues }) => {
        if (process.env.NODE_ENV == "development"){
            console.log(values)
            setTimeout(() => {
                let response = {
                    "instrumentSheetUrl": "https://docs.google.com/spreadsheets/d/11wPJM1iRc6HLmI11pQIzIhhUuyy9KgmWxCyOtETILqE/edit#gid=1536483209",
                    "statusCode": 200,
                    "status": "Success"
                }
                setValues(initialValues)
                setAlert("success", "Success", `At least one entry must be manually added to the sheet. Click <a href=${response.instrumentSheetUrl} target="_blank"><b>here</b></a> to open the sheet.`, 15);
                setSubmitting(false);
            }, 400);
        }
        else{
            // @ts-ignore
            google.script.run.withSuccessHandler((response) => {
                if(response.statusCode >= 200 && response.statusCode < 300){
                    setValues(initialValues)
                    setAlert("success", "Success", `At least one entry must be manually added to the sheet. Click <a href=${response.instrumentSheetUrl} target="_blank"><b>here</b></a> to open the sheet.`, 15);
                }
                else{
                    setAlert("error", "Error", response.status, 10);
                }
                setSubmitting(false);
                fetchSheetData(false);
            }).withFailureHandler((error) => {
                console.error("Error fetching data:", error);
                setAlert("error", "Error", "Failed to add instrument.", 10);
            }).addInstrument(values);
        }
    }

    return (
        <div className="add-instrument">
            <div className="add-instrument-title">
                Add Instrument
            </div>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
                validateOnChange={false}
            >
                {({ values, setValues, dirty, errors, isSubmitting }) => (
                    <Form className="form">
                        <div className="form-top">
                            <div className="form-field">
                                <Field component={MuiTextField} type="text" name="name" size="small" label="Name"/>
                                <ErrorMessage name="name" component="div" className="error-text"/>
                            </div>

                            <div className="form-field">
                                <Field component={MuiTextField} type="text" name="label" size="small" label="Label"
                                       InputProps={{
                                           endAdornment: (
                                               <InputAdornment position="end">
                                                   <Tooltip title="Display name for the instrument">
                                                       <IconButton>
                                                           <HelpOutlineIcon sx={{ color: 'var(--ultra-soft-color)', fontSize: "16px"}}/>
                                                       </IconButton>
                                                   </Tooltip>
                                               </InputAdornment>
                                           ),
                                       }}/>
                                <ErrorMessage name="label" component="div" className="error-text"/>
                            </div>
                            <div className="form-field">
                                <span className="checkbox-field">
                                    <div className="checkbox-label-container">
                                        <InputLabel className="form-label">Calculate XIRR</InputLabel>
                                        <FormHelperText sx={{ display: 'flex', alignItems: 'center', marginTop: 0 }}>
                                            <Tooltip title="Enable if XIRR should be calculated for this instrument.">
                                                <IconButton>
                                                    <HelpOutlineIcon sx={{ color: 'var(--ultra-soft-color)', fontSize: "16px"}}/>
                                                </IconButton>
                                            </Tooltip>
                                        </FormHelperText>
                                    </div>
                                    <Field type="checkbox" name="calculateXirr"/>
                                </span>
                            </div>

                            <div className="form-field">
                                <span className="checkbox-field position-relative pointer" onClick={() => setShowIconSelector(!showIconSelector)} ref={iconSelectorRef}>
                                    <div className="checkbox-label-container pointer">
                                        <InputLabel className="form-label pointer">Select Icon</InputLabel>
                                        <FormHelperText sx={{ display: 'flex', alignItems: 'center', marginTop: 0 }}>
                                            <Tooltip title="Instrument icon to be used for display.">
                                                <IconButton>
                                                    <HelpOutlineIcon sx={{ color: 'var(--ultra-soft-color)', fontSize: "16px"}}/>
                                                </IconButton>
                                            </Tooltip>
                                        </FormHelperText>
                                    </div>
                                    {values.icon != '' && iconMap[values.icon]}
                                    <IconSelector expand={showIconSelector} values={values} setShowIconSelector={setShowIconSelector}
                                                  iconSelectorRef={iconSelectorRef}/>
                                </span>
                            </div>
                        </div>

                        <div className="form-fields">
                            <h4>
                                Fields
                            </h4>
                            <p>
                                Note:
                                <br/> • The fields "Name," "Date," "Invested," and "Current" are mandatory fields that are added by default.
                                <br/> • Enable "Is Automated" if the field's value will be calculated using excel formula.
                                <br/> • Fields with empty "Name" value will be ignored.
                            </p>

                            <FieldArray name="fields">
                                {() =>
                                    values.fields.map((item, i) => {
                                        return (
                                            <div key={i} className="fields-container">
                                                <div className="fields-item">
                                                    <div className="form-field fields-item-text">
                                                        <Field component={MuiTextField} type="text" name={`fields.${i}.name`} size="small" label="Name"/>
                                                    </div>
                                                    <div className="select-container">
                                                        <div className="select-field">
                                                            <Field as="select" name={`fields.${i}.dataType`} id={`fields.${i}.dataType`} className="select">
                                                                <option value="" disabled>Data Type</option>
                                                                {dataTypeOptions.map((item) => (
                                                                    <option key={item} value={item}>
                                                                        {item}
                                                                    </option>
                                                                ))}
                                                            </Field>
                                                            <div className="select-label-container">
                                                                <label htmlFor={`fields.${i}.dataType`} className="select-label">
                                                                    Data Type
                                                                </label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <span className="checkbox-field fields-item-checkbox">
                                                        <div className="checkbox-label-container">
                                                            <InputLabel className="form-label">Is Automated</InputLabel>
                                                        </div>
                                                        <Field type="checkbox" name={`fields.${i}.isAutomated`}/>
                                                    </span>
                                                </div>
                                                <span className="close" onClick={() => removeField(i, values, setValues)}>
                                                    <CloseIcon className="close-icon"/>
                                                </span>
                                            </div>
                                        );
                                    })
                                }
                            </FieldArray>
                            <button
                                style={{ margin: "25px 10px 10px 0" }}
                                className="add-field-button"
                                type="button"
                                onClick={(e) => addField(values, setValues)}
                            >
                                + Add Field
                            </button>
                        </div>
                        <ErrorFocus />
                        {isSubmitting ?
                            <Loading className="submit"/> :
                            <button type="submit" disabled={isSubmitting} className="submit">
                                SUBMIT
                            </button>
                        }
                    </Form>
                )}
            </Formik>
        </div>
    );
}

export default AddInstrument