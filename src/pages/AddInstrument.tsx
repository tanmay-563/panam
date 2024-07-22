import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const lowercaseAlphabets = /^[a-z]+$/;

const validationSchema = Yup.object().shape({
    name: Yup.string().matches(lowercaseAlphabets, 'Must be only lowercase English alphabets').required('Name is required'),
    label: Yup.string(),
});

const AddInstrument = ({}) => {
    const initialValues = {
        name: '',
        email: '',
    };

    const handleSubmit = (values, { setSubmitting }) => {
        setTimeout(() => {
            console.log('Form submitted:', values);
            setSubmitting(false);
        }, 400);
    };

    return (
        <div className="add-instrument">
            Add Instrument
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting }) => (
                    <Form className="form">
                        <div className="form-field">
                            <div className="field-label">
                                <label htmlFor="name">Name</label>
                            </div>
                            <div className="field-value">
                                <Field type="text" name="name" size="medium"/>
                                <ErrorMessage name="name" component="div" className="error-text"/>
                            </div>
                        </div>

                        <div className="form-field">
                            <div className="field-label">
                                <label htmlFor="label">Label</label>
                            </div>
                            <div className="field-value">
                                <Field type="text" name="label" size="medium"/>
                                <div className="helper-text">Display name for the instrument</div>
                                <ErrorMessage name="label" component="div" className="error-text"/>
                            </div>
                        </div>

                        <button type="submit" disabled={isSubmitting}>
                            Submit
                        </button>
                    </Form>
                )}
            </Formik>
        </div>
    );
}

export default AddInstrument