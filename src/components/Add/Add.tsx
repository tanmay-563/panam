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

    const handleSubmit = () =>{
        console.log("input " + JSON.stringify(inputValues))
    }

    const handleInstrumentSelected = (entity, suggestion) => {
        console.log("suggestion ", suggestion)
        if(suggestion.Name){
            setSelectedInstrument(suggestion.Name.toLowerCase())
        }
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
                    headerMap={headerMap}
                    contentColumnMap={contentColumnMap}
                    config={config}
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