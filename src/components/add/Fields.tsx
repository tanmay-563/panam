import Field from "./Field";
import {getDataTypeMap} from "../../utils/common";
import * as React from "react";


const Fields = ({       instrument,
                        transactionsColumnMap,
                        requiredHeaders,
                        inputValues,
                        onInputChange,
                        columnMetadata,
                        error
                   }) => {
    if(!requiredHeaders)
        return <div/>

    let uniqueValues = {}
    requiredHeaders.forEach(columnName => {
        uniqueValues[columnName] = Array.from(new Set(transactionsColumnMap[instrument][columnName]));
    });

    const dataTypeMap = getDataTypeMap(columnMetadata)

    return (
        <div className="fields">
            {requiredHeaders.map(columnName => (
                <div key={columnName} className="field">
                    <Field
                        suggestions={uniqueValues[columnName]}
                        column={columnName}
                        inputValues={inputValues}
                        handleInputChange={onInputChange}
                        dataTypeMap={dataTypeMap}
                        error={error}
                    />
                </div>
            ))}
        </div>
    );
}

export default Fields