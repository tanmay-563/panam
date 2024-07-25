import React from 'react';
import {Formik, Form, Field, ErrorMessage, FieldArray} from 'formik';
import * as Yup from 'yup';
import TextField from "@mui/material/TextField";
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import {FormHelperText, IconButton, InputAdornment, InputLabel, MenuItem, Select, Tooltip} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

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

    const initialValues = {
        name: '',
        label: '',
        calculateXirr: true,
        iconUrl: '',
        fields: [
            {
                name: '',
                dataType: sheetMetadata[0],
                isAutomated: false,
            }
        ]
    };

    const removeField = (i, values, setValues) => {
        const fields = [...values.fields];
        fields.splice(i, 1);
        setValues({ ...values, fields });
    };

    const addField = (values, setValues) => {
        const fields = [...values.fields];
        fields.push({
            name: '',
            dataType: sheetMetadata[0],
            isAutomated: false,
        });
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
                {({ values, setValues, handleChange, handleBlur, isSubmitting }) => (
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
                                <div className="select-container">
                                    <div className="select-label-container">
                                        <span>
                                            <InputLabel className="select-label">Calculate XIRR</InputLabel>
                                            <FormHelperText sx={{ display: 'flex', alignItems: 'center' }}>
                                                <Tooltip title="Set to true if XIRR should be calculated for this instrument.">
                                                    <IconButton>
                                                        <HelpOutlineIcon sx={{ color: 'var(--ultra-soft-color)', fontSize: "16px"}}/>
                                                    </IconButton>
                                                </Tooltip>
                                            </FormHelperText>
                                        </span>
                                    </div>
                                    <div className="select-field">
                                        <Field as="select" name="calculateXirr" className="select">
                                            <option value="true">True</option>
                                            <option value="false">False</option>
                                        </Field>
                                    </div>
                                </div>
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
                            <p>Note: The fields "Name," "Date," "Invested," and "Current" are mandatory fields that are added by default.</p>

                            <FieldArray name="info">
                                {() =>
                                    values.fields.map((item, i) => {
                                        return (
                                            <div key={i}>
                                                {values.fields.length > 1 && (
                                                    <button
                                                        className="pointer"
                                                        onClick={() => removeField(i, values, setValues)}
                                                    >
                                                        <CloseIcon />
                                                    </button>
                                                )}

                                                <div className="fields-item">
                                                    <Field component={MuiTextField} type="text" name={`fields.${i}.name`} size="small" label="Name"/>
                                                    <ErrorMessage name={`fields.${i}.name`} component="div" className="error-text"/>
                                                    <div className="select-container">
                                                        <div className="select-label-container">
                                                            <InputLabel className="select-label">Is Automated</InputLabel>
                                                        </div>
                                                        <div className="select-field">
                                                            <Field as="select" name={`fields.${i}.isAutomated`} className="select">
                                                                <option value="true">True</option>
                                                                <option value="false">False</option>
                                                            </Field>
                                                        </div>
                                                    </div>
                                                    <div className="select-container">
                                                        <div className="select-label-container">
                                                            <InputLabel className="select-label">Data Type</InputLabel>
                                                        </div>
                                                        <div className="select-field">
                                                            <Field as="select" name={`fields.${i}.datatType`} className="select">
                                                                {dataTypeOptions.map((item) => (
                                                                    <option key={item} value={item}>
                                                                        {item}
                                                                    </option>
                                                                ))}
                                                            </Field>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                }
                            </FieldArray>
                            <button
                                style={{ margin: "25px 10px 10px 0" }}
                                className="pointer"
                                type="button"
                                onClick={(e) => addField(values, setValues)}
                            >
                                Click to add information
                            </button>
                        </div>

                        <button type="submit" disabled={isSubmitting} className="submit">
                            Submit
                        </button>
                    </Form>
                )}
            </Formik>
        </div>
    );
}

export default AddInstrument