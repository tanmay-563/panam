import AutocompleteWrapper from "./AutocompleteWrapper";

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

    const handleInputChange = (column, value) => {
        inputValues[column] = value
    };

    return (
        <div className="fields">
            {requiredHeaders.map(columnName => (
                <div key={columnName} className="field">
                    <AutocompleteWrapper
                        suggestions={uniqueValues[columnName]}
                        column={columnName}
                        handleInputChange={handleInputChange}
                        />
                </div>
            ))}
        </div>
    );
}

export default Fields