import React, {useState} from 'react'
import AutosuggestWrapper from "./AutosuggestWrapper";

function getUniqueColumnValues(instrument, headers, contentColumnMap, config){
    const uniqueValues = {};
    try{
        let columnConfig= config["_columns"].filter(item => item.Instrument.toLowerCase() === instrument.toLowerCase());
        let isAutomatedColumns = columnConfig.filter(config => config.isAutomated == true).map(config => config.Column);
        headers = headers.filter(header => !isAutomatedColumns.includes(header));

        headers.forEach(columnName => {
            uniqueValues[columnName] = Array.from(new Set(contentColumnMap[instrument][columnName]));
        });
        return uniqueValues
    }
    catch (e){
        return uniqueValues
    }
}

const Fields = ({
                       instrument,
                       headerMap,
                    contentColumnMap,
                    config
                   }) => {
    let headers = headerMap[instrument]
    if(!headers){
        return (
            <div/>
        )
    }
    const uniqueValues = getUniqueColumnValues(instrument, headers, contentColumnMap, config)

    const [values, setValues] = useState({});

    const handleSubmit = event => {
        event.preventDefault();
        console.log(values);
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