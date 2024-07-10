import React, {useState} from 'react'
import AutosuggestWrapper from "./AutosuggestWrapper";
import AutocompleteWrapper from "./AutocompleteWrapper";

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
                       contentColumnMap,
                       requiredHeaders,
                       inputValues
                   }) => {
    if(!requiredHeaders)
        return <div/>
    let uniqueValues = {}
    requiredHeaders.forEach(columnName => {
        uniqueValues[columnName] = Array.from(new Set(contentColumnMap[instrument][columnName]));
    });

    const handleInputChange = (entity, suggestion) => {
        inputValues[entity] = suggestion
    };

    return (
        <div className="fields">
            {requiredHeaders.map(columnName => (
                <div key={columnName} className="field">
                    {/*<AutosuggestWrapper*/}
                    {/*    suggestions={uniqueValues[columnName]}*/}
                    {/*    onChangeHandler={handleInputChange}*/}
                    {/*    placeholder=""*/}
                    {/*    entity={columnName}*/}
                    {/*/>*/}
                    <AutocompleteWrapper
                        suggestions={uniqueValues[columnName]}
                        column={columnName}
                    />
                </div>
            ))}
        </div>
    );
}

export default Fields