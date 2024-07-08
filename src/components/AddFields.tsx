import React from 'react'
import {Field, Form, Formik} from "formik";
import Autosuggest from 'react-autosuggest';

const AddFields = ({
                       instrument,
                       headerMap,
                       dataMap
                   }) => {
    let header = headerMap[instrument]
    if(!header){
        return (
            <div/>
        )
    }
    const uniqueValues = {};

    header.forEach(columnName => {
        uniqueValues[columnName] = [];
    });

    dataMap[instrument].forEach(row => {
        header.forEach((columnName, columnIndex) => {
            const value = row[columnIndex];
            if (!uniqueValues[columnName].includes(value)) {
                uniqueValues[columnName].push(value);
            }
        });
    });

    const initialValues = {};

    headerMap[instrument].forEach(columnName => {
        initialValues[columnName] = '';
    });

    // Autosuggest component for each field
    const renderAutosuggest = ({ field, form: { setFieldValue } }) => {
        const handleChange = (_, { newValue }) => {
            setFieldValue(field.name, newValue);
        };

        const getSuggestions = value => {
            console.log("inp " + value)
            const inputValue = value.trim() && value.trim().toLowerCase();
            const suggestions = uniqueValues[field.name].filter(
                suggestion => suggestion && suggestion.toLowerCase().startsWith(inputValue)
            );
            return suggestions.slice(0, 5); // Limit suggestions to 5 items
        };

        const inputProps = {
            ...field,
            onChange: handleChange,
            placeholder: `Type ${field.name}`,
            value: field.value,
        };

        return (
            <Autosuggest
                suggestions={getSuggestions(field.value)}
                onSuggestionsFetchRequested={({ value }) => getSuggestions(value)}
                onSuggestionsClearRequested={() => {}}
                getSuggestionValue={suggestion => suggestion}
                renderSuggestion={suggestion => <div>{suggestion}</div>}
                inputProps={inputProps}
            />
        );
    };

    return (
        <Formik
            initialValues={initialValues}
            onSubmit={(values, { resetForm }) => {
                // Handle form submission here
                console.log(values);
                resetForm();
            }}
        >
            {({ handleSubmit }) => (
                <Form onSubmit={handleSubmit}>
                    {header.map(columnName => (
                        <div key={columnName}>
                            <label htmlFor={columnName}>{columnName}</label>
                            <Field name={columnName} />
                        </div>
                    ))}
                    <button type="submit">Submit</button>
                </Form>
            )}
        </Formik>
    );
}

export default AddFields