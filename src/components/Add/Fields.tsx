import React, {useState} from 'react'
import AutosuggestWrapper from "./AutosuggestWrapper";

const Fields = ({
                       instrument,
                       headerMap,
                    contentColumnMap
                   }) => {
    let headers = headerMap[instrument]
    if(!headers){
        return (
            <div/>
        )
    }
    const uniqueValues = {};

    headers.forEach(columnName => {
        uniqueValues[columnName] = Array.from(new Set(contentColumnMap[instrument][columnName]));
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
            {headers.map(columnName => (
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