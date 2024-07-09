import React, {useEffect, useState} from 'react'
import Fields from "./Fields";
import AutosuggestWrapper from "./AutosuggestWrapper";
import {getDisplayName} from "../../utils/helper";

const Add = ({
                 instruments,
                 headerMap,
                 contentColumnMap,
                 selectedMenuItem,
                 setOpenAdd,
                config
             }) => {
    const instrumentsConfig = config?._instruments || {};
    const [selectedInstrument, setSelectedInstrument] = useState('');
    let inputValues = {}

    useEffect(()=>{
        if(instruments.includes(selectedMenuItem)){
            setSelectedInstrument(selectedMenuItem)
        }
    }, [selectedMenuItem])

    const  getRequiredHeaders = (instrument) =>{
        try{
            let columnConfig= config["_columns"].filter(item => item.Instrument.toLowerCase() === instrument.toLowerCase());
            let isAutomatedColumns = columnConfig.filter(config => config.isAutomated == true).map(config => config.Column);
            return headerMap[instrument].filter(header => !isAutomatedColumns.includes(header));
        }
        catch (e){
            return headerMap[instrument]
        }
    }

    const handleSubmit = () =>{
        const requiredHeaders = getRequiredHeaders(selectedInstrument)
        requiredHeaders.forEach((header)=>{
            console.log("header " + header)
            console.log("data " + JSON.stringify(inputValues[header]))
        })
    }

    const handleInstrumentSelected = (entity, suggestion) => {
        setSelectedInstrument(suggestion.Name?.toLowerCase() ?? suggestion);
    };

    return (
        <div className="add">
            <div className="modal">
                <span className="close" onClick={()=>setOpenAdd(false)}>X</span>
                <h1> Add new transaction</h1>
                <form className="form">
                    <div className="fields">
                        <div className="field">
                            <label>Instrument Type</label>
                            <div>
                                <AutosuggestWrapper
                                    suggestions={instrumentsConfig}
                                    onChangeHandler={handleInstrumentSelected}
                                    placeholder={getDisplayName(instrumentsConfig, selectedInstrument)}
                                    entity="Instrument Type"
                                    suggestionsKey="Display Name"
                                />
                            </div>
                        </div>
                    </div>
                </form>
                <Fields
                    instrument={selectedInstrument}
                    requiredHeaders={getRequiredHeaders(selectedInstrument)}
                    contentColumnMap={contentColumnMap}
                    inputValues={inputValues}
                />
                <div className="modalFooter">
                    {selectedInstrument != ''
                        && <div className="submit" onClick={handleSubmit}>
                            SUBMIT
                            </div>}
                </div>
            </div>
        </div>
    )
}

export default Add