import React, {useState} from 'react'
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

    const handleSubmit = event => {
        event.preventDefault();
        console.log(values); // Handle form submission logic here
        setValues({});
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