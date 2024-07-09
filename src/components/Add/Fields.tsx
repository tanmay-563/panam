import React, {useState} from 'react'
import AutosuggestWrapper from "./AutosuggestWrapper";

function getRequiredHeaders(instrument, headers, contentColumnMap, config){
    try{
        let columnConfig= config["_columns"].filter(item => item.Instrument.toLowerCase() === instrument.toLowerCase());
        let isAutomatedColumns = columnConfig.filter(config => config.isAutomated == true).map(config => config.Column);
        return headers.filter(header => !isAutomatedColumns.includes(header));
    }
    catch (e){
        return headers
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
    headers = getRequiredHeaders(instrument, headers, contentColumnMap, config)

    let uniqueValues = {}
    headers.forEach(columnName => {
        uniqueValues[columnName] = Array.from(new Set(contentColumnMap[instrument][columnName]));
    });

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
        <form onSubmit={handleSubmit} className="form">
            <div className="fields">
                {headers.map(columnName => (
                    <div key={columnName} className="field">
                        <label htmlFor={columnName}>{columnName}</label>
                        <AutosuggestWrapper
                            suggestions={uniqueValues[columnName]}
                            onSuggestionSelected={handleSuggestionsSelected}
                            placeholder=""
                        />
                    </div>
                ))}
            </div>
            <div className="submit">Submit</div>
        </form>
    );
}

export default Fields