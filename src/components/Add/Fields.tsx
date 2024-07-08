import React, {useState} from 'react'
import {Field, Form, Formik} from "formik";
import AutosuggestWrapper from "./AutosuggestWrapper";

const Fields = ({
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

    const [values, setValues] = useState({});
    const handleChange = (columnName, value) => {
        setValues(prevValues => ({
            ...prevValues,
            [columnName]: value
        }));
    };

    const handleSubmit = event => {
        event.preventDefault();
        console.log(values); // Handle form submission logic here
        // Reset form state if needed
        setValues({});
    };

    // Autosuggest component for each field
    const renderAutosuggest = columnName => {
        const value = values[columnName] || '';
        const handleChangeInput = (_, { newValue }) => {
            handleChange(columnName, newValue);
        };

        const getSuggestions = value => {
            const inputValue = value.trim().toLowerCase();
            const suggestions = uniqueValues[columnName].filter(
                suggestion => suggestion && suggestion.toLowerCase().startsWith(inputValue)
            );
            return suggestions.slice(0, 5); // Limit suggestions to 5 items
        };

        const inputProps = {
            value,
            onChange: handleChangeInput,
            placeholder: `Type ${columnName}`
        };

        return (
            <Autosuggest
                suggestions={getSuggestions(value)}
                onSuggestionsFetchRequested={({ value }) => getSuggestions(value)}
                onSuggestionsClearRequested={() => {}}
                getSuggestionValue={suggestion => suggestion}
                renderSuggestion={suggestion => <div>{suggestion}</div>}
                inputProps={inputProps}
            />
        );
    };

    const handleSuggestionsSelected = (suggestion) => {
        console.log('Selected:', suggestion);
    };

    return (
        <form onSubmit={handleSubmit}>
            {header.map(columnName => (
                <div key={columnName}>
                    <label htmlFor={columnName}>{columnName}</label>
                    <AutosuggestWrapper
                        suggestions={uniqueValues[columnName]}
                        onSuggestionSelected={handleSuggestionsSelected}
                        placeholder=""
                    />
                </div>
            ))}
            <button type="submit">Submit</button>
        </form>
    );
}

export default Fields