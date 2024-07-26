import React from 'react';
import {Formik, Form, Field, ErrorMessage, FieldArray} from 'formik';
import * as Yup from 'yup';
import TextField from "@mui/material/TextField";
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import {FormHelperText, IconButton, InputAdornment, InputLabel, MenuItem, Select, Tooltip} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ErrorFocus from "../components/external/ErrorFocus"

const validationSchema = Yup.object().shape({
    name: Yup.string().matches(/^[a-z]+$/, 'Only lowercase English alphabets allowed').required('Name is required'),
    label: Yup.string().required("Label is required"),
    iconUrl: Yup.string().matches(
        /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
        'Invalid URL'
    ),
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

const AddInstrument = ({metadata}) => {
    if(!metadata)
        return <div></div>
    const sheetMetadata = metadata.sheet
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
        iconUrl: '',
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

    const handleSubmit = (values, { setSubmitting }) => {
        setTimeout(() => {
            console.log('Form submitted:', values);
            setSubmitting(false);
        }, 400);
    };

    return (
        <div className="add-instrument">
            <div className="add-instrument-title">
                Add Instrument
            </div>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
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
                                <Field component={MuiTextField} type="text" name="iconUrl" size="small" label="Icon URL"
                                       InputProps={{
                                           endAdornment: (
                                               <InputAdornment position="end">
                                                   <Tooltip title="URL for an icon to be used for display. Leave blank to use default icon.">
                                                       <IconButton>
                                                           <HelpOutlineIcon sx={{ color: 'var(--ultra-soft-color)', fontSize: "16px"}}/>
                                                       </IconButton>
                                                   </Tooltip>
                                               </InputAdornment>
                                           ),
                                       }}/>
                                <ErrorMessage name="iconUrl" component="div" className="error-text"/>
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
                                                    <span className="checkbox-field">
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
                        <button type="submit" disabled={isSubmitting} className="submit">
                            SUBMIT
                        </button>
                    </Form>
                )}
            </Formik>
        </div>
    );
}

export default AddInstrument