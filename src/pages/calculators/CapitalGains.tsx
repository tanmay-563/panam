import React, {useEffect, useState} from "react";
import DynamicSelect from "../../components/DynamicSelect";
import CapitalGainsField from "./CapitalGainsField";

const CapitalGains = ({   metadata,
                          transactionsRowMap,
                          aggregatedData,
}) => {
    const instrumentMetadata = metadata?.instrument
    if (!instrumentMetadata) {
        return <div></div>;
    }
    const [selectedInstrument, setSelectedInstrument] = useState('')
    const [selectedUnitField, setSelectedUnitField] = useState('')
    const [selectedCurrentNavField, setSelectedCurrentNavField] = useState('')
    const [selectedBuyNavField, setSelectedBuyNavField] = useState('')
    const [columnMetadata, setColumnMetadata] = useState([])
    const [instrumentUniqueNames, setInstrumentUniqueNames] = useState([]);

    useEffect(()=>{
        try{
            setColumnMetadata(metadata.column.filter((item)=>
                    item.Instrument.toLowerCase() === selectedInstrument.toLowerCase()
                    && item.DataType.toLowerCase() !== "text"
                    && item.DataType.toLowerCase() !== "date"
                    && (item.Column.toLowerCase() !== "id")
                ));
            setInstrumentUniqueNames(Object.keys(aggregatedData[1][selectedInstrument]["name"]))
            // setInstrumentUniqueNames(Array.from(new Set(transactionsColumnMap[selectedInstrument]["Name"])))
        }
        catch (e){
            setColumnMetadata([])
        }
    }, [selectedInstrument])

    const handleInstrumentChange = (value) => {
        setSelectedInstrument(value)
        setSelectedCurrentNavField('')
        setSelectedUnitField('')
        setSelectedBuyNavField('')
    }

    return (
        <div className="form-page">
            <div className="form-page-title">
                Capital Gains Calculator
                <p>
                    *Unrealized gains only
                </p>
            </div>
            <div className="form calculator-form">
                <div className="calculator-form-top">
                    <div className="calculator-form-top-field">
                        <DynamicSelect
                            selectedValue={selectedInstrument}
                            onSelectionChange={handleInstrumentChange}
                            data={instrumentMetadata}
                            valueField="Name"
                            labelField="Label"
                            uniqueId="capitalGainsInstrumentSelector"
                            inputLabel="Instrument Type"
                        />
                    </div>
                    <div className="calculator-form-top-field">
                        <DynamicSelect
                            selectedValue={selectedUnitField}
                            onSelectionChange={setSelectedUnitField}
                            data={columnMetadata}
                            valueField="Column"
                            labelField="Column"
                            uniqueId="capitalGainsUnitsFieldSelector"
                            inputLabel="Units Field"
                        />
                    </div>
                    <div className="calculator-form-top-field">
                        <DynamicSelect
                            selectedValue={selectedBuyNavField}
                            onSelectionChange={setSelectedBuyNavField}
                            data={columnMetadata}
                            valueField="Column"
                            labelField="Column"
                            uniqueId="capitalGainsBuyNavFieldSelector"
                            inputLabel="Buy NAV Field"
                        />
                    </div>
                    <div className="calculator-form-top-field">
                        <DynamicSelect
                            selectedValue={selectedCurrentNavField}
                            onSelectionChange={setSelectedCurrentNavField}
                            data={columnMetadata}
                            valueField="Column"
                            labelField="Column"
                            uniqueId="capitalGainsCurrentNavFieldSelector"
                            inputLabel="Current NAV Field"
                        />
                    </div>
                </div>
                <div className="calculated-data">
                    {selectedInstrument != '' && selectedUnitField != ''
                        && selectedBuyNavField != '' && selectedCurrentNavField != ''
                        && instrumentUniqueNames.length > 0 &&
                        instrumentUniqueNames.map((key, index) => (
                            <div key = {key}>
                                <CapitalGainsField
                                    selectedInstrument={selectedInstrument}
                                    selectedUnitField={selectedUnitField}
                                    selectedBuyNavField={selectedBuyNavField}
                                    selectedCurrentNavField={selectedCurrentNavField}
                                    transactionsRowMap={transactionsRowMap}
                                    fieldName={key}
                                    key={key}
                                />
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}

export default CapitalGains