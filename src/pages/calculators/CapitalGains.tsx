import React, {useEffect, useState} from "react";
import {ErrorMessage, Field, Form, Formik} from "formik";
import * as Yup from "yup";
import Loading from "../../components/Loading";
import TextField from "@mui/material/TextField";
import {FormControl, InputAdornment, InputLabel, MenuItem, Select} from "@mui/material";
import {getCapitalGainsData} from "../../utils/calculator.utils";
import {Simulate} from "react-dom/test-utils";
import select = Simulate.select;
import DynamicSelect from "../../components/DynamicSelect";
import CapitalGainsField from "./CapitalGainsField";

const CapitalGains = ({   metadata,
                          transactionsRowMap,
                          aggregatedData,
}) => {
    if(!metadata)
        return <div></div>

    const [selectedInstrument, setSelectedInstrument] = useState('')
    const [selectedUnitField, setSelectedUnitField] = useState('')
    const [selectedNavField, setSelectedNavField] = useState('')
    const [columnMetadata, setColumnMetadata] = useState([])
    const [instrumentUniqueNames, setInstrumentUniqueNames] = useState([]);
    const instrumentMetadata = metadata.instrument

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
        setSelectedNavField('')
        setSelectedUnitField('')
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
                        selectedValue={selectedNavField}
                        onSelectionChange={setSelectedNavField}
                        data={columnMetadata}
                        valueField="Column"
                        labelField="Column"
                        uniqueId="capitalGainsNavFieldSelector"
                        inputLabel="Current NAV Field"
                    />
                </div>
                <div className="calculated-data">
                    {selectedInstrument != '' &&
                        instrumentUniqueNames.length > 0 &&
                        instrumentUniqueNames.map((key, index) => (
                            <CapitalGainsField
                                selectedInstrument={selectedInstrument}
                                selectedUnitField={selectedUnitField}
                                selectedNavField={selectedNavField}
                                transactionsRowMap={transactionsRowMap}
                                fieldName={key}
                            />
                        ))
                    }
                </div>
            </div>
        </div>
    )
}

export default CapitalGains