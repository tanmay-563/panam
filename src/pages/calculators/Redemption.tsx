import React, {useEffect, useState} from "react";
import DynamicSelect from "../../components/DynamicSelect";
import RedemptionField from "./RedemptionField";
import MuiTextField from "../../components/MuiTextField";

const Redemption = ({   metadata,
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
    const [redemptionUnits, setRedemptionUnits] = useState(0)
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
        }
        catch (e){
            setColumnMetadata([])
        }
    }, [selectedInstrument])

    const handleInstrumentChange = (value) => {
        setSelectedInstrument(value)
        setSelectedCurrentNavField('')
        setSelectedUnitField('')
        setRedemptionUnits(0)
    }

    return (
        <div className="form-page">
            <div className="form-page-title">
                Redemption Calculator
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
                            uniqueId="redemptionInstrumentSelector"
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
                            uniqueId="redemptionUnitsFieldSelector"
                            inputLabel="Units Field"
                        />
                    </div>
                    <div className="calculator-form-top-field">
                        <DynamicSelect
                            selectedValue={selectedCurrentNavField}
                            onSelectionChange={setSelectedCurrentNavField}
                            data={columnMetadata}
                            valueField="Column"
                            labelField="Column"
                            uniqueId="redemptionCurrentNavFieldSelector"
                            inputLabel="Current NAV Field"
                        />
                    </div>
                    <div className="calculator-form-top-field">
                        <MuiTextField label="Units to Redeeem" value={redemptionUnits} setValue={setRedemptionUnits} width='100%' height='100%' fontSize='24px'/>
                    </div>
                </div>
                <div className="calculated-data">
                    {selectedInstrument != '' && selectedUnitField != ''
                        && selectedCurrentNavField != '' && redemptionUnits > 0
                        && instrumentUniqueNames.length > 0 &&
                        instrumentUniqueNames.map((key, index) => (
                            <div key = {key}>
                                <RedemptionField
                                    selectedInstrument={selectedInstrument}
                                    selectedUnitField={selectedUnitField}
                                    selectedCurrentNavField={selectedCurrentNavField}
                                    redemptionUnits={redemptionUnits}
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

export default Redemption